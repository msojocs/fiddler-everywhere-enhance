package fe_test

import (
	"errors"
	"fe-tool/fe"
	"log"
	"os"
	"testing"
)

func init() {
	// 0.准备文件夹
	log.Println("check cache dir.")
	_, err := os.Stat("cache")
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			// 不存在
			err := os.Mkdir("cache", 0755)
			if err != nil {
				log.Fatalln("Create dir error:", err)
			} else {
				log.Println("Create dir ok.")
			}
		} else {
			log.Fatalln("Check cache dir error:", err)
		}
	}

}
func TestDownload(t *testing.T) {
	fe.Download("latest")
}

func TestExtract(t *testing.T) {
	log.Println("---start---")
	fe.Extract("")
}
