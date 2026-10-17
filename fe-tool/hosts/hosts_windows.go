package hosts

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// hostsPath 系统 hosts 文件路径
func hostsPath() string {
	winDir := os.Getenv("SystemRoot")
	if winDir == "" {
		winDir = `C:\Windows`
	}
	path := filepath.Join(winDir, "System32", "drivers", "etc", "hosts")
	if _, err := os.Stat(path); err != nil {
		// 32 位进程在 64 位系统上访问 System32 会被重定向到 SysWOW64，此时改用 Sysnative
		if _, err := os.Stat(filepath.Join(winDir, "Sysnative", "drivers", "etc", "hosts")); err == nil {
			return filepath.Join(winDir, "Sysnative", "drivers", "etc", "hosts")
		}
	}
	return path
}

// elevateWrite 写入临时文件后，通过 PowerShell 触发 UAC 弹窗，以管理员权限复制到 hosts
func elevateWrite(target string, newContent string) error {
	tmpPath := filepath.Join(os.TempDir(), "fe-tool-hosts.txt")
	if err := os.WriteFile(tmpPath, []byte(newContent), 0644); err != nil {
		return err
	}
	defer os.Remove(tmpPath)

	scriptPath := filepath.Join(os.TempDir(), "fe-tool-hosts.ps1")
	if err := os.WriteFile(scriptPath, []byte(copyScript(tmpPath, target)), 0644); err != nil {
		return err
	}
	defer os.Remove(scriptPath)
	cmd := exec.Command("powershell", "-NoProfile", "-Command", runScriptCommand(scriptPath, true))
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("%v: %s", err, strings.TrimSpace(string(out)))
	}
	return nil
}

// copyScript 生成将临时文件复制到 hosts 的脚本内容
// Copy-Item 失败默认是非终止性错误，脚本仍会退出 0，必须先改为 Stop 让失败透出
func copyScript(tmpPath string, target string) string {
	return fmt.Sprintf("$ErrorActionPreference = 'Stop'\nCopy-Item -LiteralPath %s -Destination %s -Force\n",
		psQuote(tmpPath), psQuote(target))
}

// runScriptCommand 构造通过 Start-Process 运行脚本并透传退出码的 PowerShell 命令
// runAs 为 true 时触发 UAC 申请管理员权限
func runScriptCommand(scriptPath string, runAs bool) string {
	verb := ""
	if runAs {
		verb = "-Verb RunAs "
	}
	// 注意：-Wait 配合 -PassThru 管道时不会等待，必须显式调用 WaitForExit
	// ShellExecute 启动的进程 ExitCode 可能为 $null，此时按失败处理
	return fmt.Sprintf(
		"$p = Start-Process powershell %s-PassThru -WindowStyle Hidden -ErrorAction Stop -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',%s); $p.WaitForExit() | Out-Null; if ($null -eq $p.ExitCode) { exit 1 }; exit $p.ExitCode",
		verb, psQuote(scriptPath),
	)
}

// psQuote 用单引号包裹 PowerShell 字符串字面量
func psQuote(s string) string {
	return "'" + strings.ReplaceAll(s, "'", "''") + "'"
}
