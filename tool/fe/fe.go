package fe

import (
	"bufio"
	"fe-tool/common"
	"io"
	"log"
	"net/http"
	"os"
)

const TargetDir = "FiddlerEverywhere"

func Download() {
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
