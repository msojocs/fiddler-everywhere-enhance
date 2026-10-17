package hosts

import (
	"fmt"
	"log"
	"os"
	"strings"
)

// hostsEntries 增强所需的域名解析条目
var hostsEntries = []string{
	"127.0.0.1 api.getfiddler.be",
	"127.0.0.1 identity.getfiddler.be",
}

// marker hosts 条目的注释标记
const marker = "fiddler-everywhere-enhance"

// Apply 将增强所需的域名解析条目写入系统 hosts 文件
func Apply() {
	log.Println("Apply hosts patch.")
	if err := applyTo(hostsPath()); err != nil {
		log.Println("Apply hosts error:", err)
		log.Fatalln(manualHint())
	}
}

// applyTo 向指定 hosts 文件补充缺失的条目，已存在时跳过
func applyTo(path string) error {
	content, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	missing := missingEntries(string(content))
	if len(missing) == 0 {
		log.Println("Hosts entries already exist, skip.")
		return nil
	}

	// hosts 文件末尾可能没有换行，先补一个换行，避免条目拼接到最后一行
	block := "# " + marker + "\n" + strings.Join(missing, "\n") + "\n"
	if !strings.HasSuffix(string(content), "\n") {
		block = "\n" + block
	}

	// 先尝试直接写入（Linux root 或已提权的终端）
	err = appendFile(path, block)
	if err == nil {
		log.Println("Hosts patched:", path)
		return nil
	}

	// 无权限时申请管理员权限写入
	log.Println("Write hosts denied:", err)
	log.Println("Requesting administrator privilege ......")
	err = elevateWrite(path, string(content)+block)
	if err != nil {
		return err
	}
	// 校验写入结果
	content, err = os.ReadFile(path)
	if err != nil {
		return err
	}
	if missing := missingEntries(string(content)); len(missing) > 0 {
		return fmt.Errorf("entries still missing after patch: %v", missing)
	}
	log.Println("Hosts patched:", path)
	return nil
}

// appendFile 以追加方式写入 hosts 条目
func appendFile(path string, block string) error {
	file, err := os.OpenFile(path, os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()
	_, err = file.WriteString(block)
	return err
}

// missingEntries 返回 hosts 内容中尚不存在的条目
func missingEntries(content string) []string {
	var missing []string
	for _, entry := range hostsEntries {
		if !hasEntry(content, entry) {
			missing = append(missing, entry)
		}
	}
	return missing
}

// hasEntry 判断 hosts 内容中是否已有解析该域名的条目（跳过注释）
func hasEntry(content string, entry string) bool {
	domain := strings.Fields(entry)[1]
	for line := range strings.SplitSeq(content, "\n") {
		for field := range strings.FieldsSeq(line) {
			// 该行剩余部分为注释，不再参与判断
			if strings.HasPrefix(field, "#") {
				break
			}
			if strings.EqualFold(field, domain) {
				return true
			}
		}
	}
	return false
}

// manualHint hosts 写入失败时的手动操作提示
func manualHint() string {
	return fmt.Sprintf("Please manually add the following entries to %s with administrator privileges:\n%s",
		hostsPath(), strings.Join(hostsEntries, "\n"))
}
