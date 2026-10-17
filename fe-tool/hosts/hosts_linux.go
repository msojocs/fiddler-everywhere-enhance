package hosts

import (
	"os"
	"os/exec"
	"path/filepath"
)

// hostsPath 系统 hosts 文件路径
func hostsPath() string {
	return "/etc/hosts"
}

// elevateWrite 写入临时文件后，通过 sudo 复制到 hosts，继承终端以输入密码
func elevateWrite(target string, newContent string) error {
	tmpPath := filepath.Join(os.TempDir(), "fe-tool-hosts.txt")
	if err := os.WriteFile(tmpPath, []byte(newContent), 0644); err != nil {
		return err
	}
	defer os.Remove(tmpPath)
	cmd := exec.Command("sudo", "cp", tmpPath, target)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
