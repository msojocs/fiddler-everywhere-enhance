package hosts

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestHasEntry(t *testing.T) {
	cases := []struct {
		name    string
		content string
		entry   string
		want    bool
	}{
		{"空内容", "", "127.0.0.1 api.getfiddler.be", false},
		{"已存在", "127.0.0.1 localhost\n127.0.0.1 api.getfiddler.be\n", "127.0.0.1 api.getfiddler.be", true},
		{"CRLF 换行", "127.0.0.1 api.getfiddler.be\r\n", "127.0.0.1 api.getfiddler.be", true},
		{"域名大小写不同", "127.0.0.1 API.GetFiddler.Be\n", "127.0.0.1 api.getfiddler.be", true},
		{"仅注释中出现", "# 127.0.0.1 api.getfiddler.be\n", "127.0.0.1 api.getfiddler.be", false},
		{"行尾注释", "127.0.0.1 localhost # api.getfiddler.be\n", "127.0.0.1 api.getfiddler.be", false},
		{"映射到其他 IP", "192.168.1.1 api.getfiddler.be\n", "127.0.0.1 api.getfiddler.be", true},
		{"域名仅作前缀", "127.0.0.1 api.getfiddler.becker\n", "127.0.0.1 api.getfiddler.be", false},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if got := hasEntry(c.content, c.entry); got != c.want {
				t.Errorf("hasEntry(%q) = %v, want %v", c.content, got, c.want)
			}
		})
	}
}

func TestMissingEntries(t *testing.T) {
	empty := missingEntries("")
	if len(empty) != len(hostsEntries) {
		t.Errorf("空内容应缺少全部条目，got %v", empty)
	}
	full := "# fiddler-everywhere-enhance\n" + strings.Join(hostsEntries, "\n") + "\n"
	if missing := missingEntries(full); len(missing) != 0 {
		t.Errorf("完整内容不应缺少条目，got %v", missing)
	}
	partial := "127.0.0.1 api.getfiddler.be\n"
	missing := missingEntries(partial)
	if len(missing) != 1 || missing[0] != hostsEntries[1] {
		t.Errorf("应仅缺少 %s，got %v", hostsEntries[1], missing)
	}
}

func TestApplyTo(t *testing.T) {
	path := filepath.Join(t.TempDir(), "hosts")

	// 0. 文件不存在时应返回错误
	if err := applyTo(path); err == nil {
		t.Error("hosts 文件不存在时应返回错误")
	}

	// 1. 向空文件追加全部条目
	if err := os.WriteFile(path, nil, 0644); err != nil {
		t.Fatal("Write hosts file error:", err)
	}
	if err := applyTo(path); err != nil {
		t.Fatal("applyTo error:", err)
	}
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatal("Read hosts file error:", err)
	}
	if missing := missingEntries(string(content)); len(missing) != 0 {
		t.Errorf("追加后仍有缺失条目: %v, content: %q", missing, content)
	}

	// 2. 重复执行应跳过且内容不变
	before := string(content)
	if err := applyTo(path); err != nil {
		t.Fatal("applyTo error:", err)
	}
	content, err = os.ReadFile(path)
	if err != nil {
		t.Fatal("Read hosts file error:", err)
	}
	if string(content) != before {
		t.Errorf("重复执行不应修改内容，before: %q, after: %q", before, content)
	}

	// 3. 末尾无换行的文件，追加内容不应拼接到最后一行
	path = filepath.Join(t.TempDir(), "hosts")
	if err := os.WriteFile(path, []byte("127.0.0.1 localhost"), 0644); err != nil {
		t.Fatal("Write hosts file error:", err)
	}
	if err := applyTo(path); err != nil {
		t.Fatal("applyTo error:", err)
	}
	content, err = os.ReadFile(path)
	if err != nil {
		t.Fatal("Read hosts file error:", err)
	}
	if strings.Count(string(content), "127.0.0.1 localhost") != 1 {
		t.Errorf("条目不应拼接到原有行，content: %q", content)
	}
	if !hasEntry(string(content), hostsEntries[0]) {
		t.Errorf("缺少条目 %s, content: %q", hostsEntries[0], content)
	}
}
