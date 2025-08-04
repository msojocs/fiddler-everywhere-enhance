package server

import (
	"bufio"
	"errors"
	"fe-tool/common"
	"io"
	"log"
	"net/http"
	"os"
)

const TargetDir = "."

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
	if s, err := os.Stat("cache/server.zip"); err == nil && !s.IsDir() {
		log.Println("cache/server.zip exists.")
		return
	}
	file, err := os.Create("cache/server.zip.tmp")
	if err != nil {
		log.Fatalln("Create file error:" + err.Error())
	}

	writer := bufio.NewWriter(file)
	client := http.Client{}
	resp, err := client.Get("https://github.com/msojocs/fiddler-everywhere-enhance/archive/refs/heads/main.zip")
	if err != nil {
		file.Close()
		log.Fatalln("Download server error:" + err.Error())
	}
	defer resp.Body.Close()

	fileSize, err := io.Copy(writer, resp.Body)
	file.Close()
	if err != nil {
		log.Fatalln("Write file error:" + err.Error())
	}

	err = os.Rename("cache/server.zip.tmp", "cache/server.zip")
	if err != nil {
		log.Fatalln("Rename server.zip.tmp error", err)
	}
	log.Println("Download end, file size:", fileSize)
}

func Extract() {
	err := common.ExtractZipArchive("cache/server.zip", TargetDir)
	if err != nil {
		log.Fatalln("Extract error:", err)
	}
}
