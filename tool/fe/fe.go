package fe

import (
	"bufio"
	"errors"
	"fe-tool/common"
	"io"
	"log"
	"net/http"
	"os"
)

const TargetDir = "FiddlerEverywhere"

func Download() {
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
	if s, err := os.Stat("cache/fe.exe"); err == nil && !s.IsDir() {
		log.Println("cache/fe.exe exists.")
		return
	}
	file, err := os.Create("cache/fe.exe.tmp")
	if err != nil {
		log.Fatalln("Create file error:" + err.Error())
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	client := http.Client{}
	resp, err := client.Get("https://api.getfiddler.com/win/latest")
	if err != nil {
		file.Close()
		log.Fatalln("Download EF error:" + err.Error())
	}
	defer resp.Body.Close()

	fileSize, err := io.Copy(writer, resp.Body)

	file.Close()
	if err != nil {
		log.Fatalln("Write file error:" + err.Error())
	}
	err = os.Rename("cache/fe.exe.tmp", "cache/fe.exe")
	if err != nil {
		log.Fatalln("Rename fe.exe.tmp error", err)
	}
	log.Println("Download end, file size:", fileSize)
}

func Extract() {
	common.ExtractArchive("cache/fe.exe", TargetDir)
}
