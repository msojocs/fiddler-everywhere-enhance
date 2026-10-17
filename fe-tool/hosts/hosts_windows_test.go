package hosts

import (
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

// TestRunScriptCommand 验证 Start-Process 命令的参数传递与退出码透传
// 不带 RunAs，避免测试时弹出 UAC；RunAs 形态需人工验证
func TestRunScriptCommand(t *testing.T) {
	dir := t.TempDir()
	src := filepath.Join(dir, "src.txt")
	dst := filepath.Join(dir, "dst.txt")
	if err := os.WriteFile(src, []byte("new"), 0644); err != nil {
		t.Fatal("Write src error:", err)
	}
	if err := os.WriteFile(dst, []byte("old"), 0644); err != nil {
		t.Fatal("Write dst error:", err)
	}
	script := filepath.Join(dir, "copy.ps1")
	if err := os.WriteFile(script, []byte(copyScript(src, dst)), 0644); err != nil {
		t.Fatal("Write script error:", err)
	}

	cmd := exec.Command("powershell", "-NoProfile", "-Command", runScriptCommand(script, false))
	if out, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("run script error: %v, output: %s", err, out)
	}
	content, err := os.ReadFile(dst)
	if err != nil {
		t.Fatal("Read dst error:", err)
	}
	if string(content) != "new" {
		t.Errorf("复制未生效，dst: %q", content)
	}

	// 复制失败时脚本必须以非 0 退出（验证 $ErrorActionPreference = 'Stop'）
	bad := filepath.Join(dir, "bad.ps1")
	if err := os.WriteFile(bad, []byte(copyScript(filepath.Join(dir, "not-exist.txt"), dst)), 0644); err != nil {
		t.Fatal("Write script error:", err)
	}
	cmd = exec.Command("powershell", "-NoProfile", "-Command", runScriptCommand(bad, false))
	err = cmd.Run()
	if err == nil {
		t.Error("复制失败时应返回错误")
	} else if exitErr, ok := err.(*exec.ExitError); !ok || exitErr.ExitCode() == 0 {
		t.Errorf("失败时退出码应为非 0，got: %v", err)
	}
}
