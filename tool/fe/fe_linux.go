package fe

import (
	"bufio"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
)

const TargetDir = "FiddlerEverywhere"

func Download() {
	if s, err := os.Stat("cache/fe.AppImage"); err == nil && !s.IsDir() {
		log.Println("cache/fe.AppImage exists.")

		err = os.Chmod("cache/fe.AppImage", 0755)
		if err != nil {
			log.Fatalln("Chmod fe.AppImage.tmp error", err)
		}
		return
	}
	file, err := os.Create("cache/fe.AppImage.tmp")
	if err != nil {
		log.Fatalln("Create file error:" + err.Error())
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	client := http.Client{}
	resp, err := client.Get("https://api.getfiddler.com/linux/latest-linux")
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
	err = os.Rename("cache/fe.AppImage.tmp", "cache/fe.AppImage")
	if err != nil {
		log.Fatalln("Rename fe.AppImage.tmp error", err)
	}
	err = os.Chmod("cache/fe.AppImage", 0755)
	if err != nil {
		log.Fatalln("Chmod fe.AppImage.tmp error", err)
	}
	log.Println("Download end, file size:", fileSize)
}

func Extract() {
	cmd := exec.Command("cache/fe.AppImage", "--appimage-extract")
	err := cmd.Run()
	if err != nil {
		log.Fatalln("AppImage extract error:", err)
	}
	os.RemoveAll("FiddlerEverywhere")
	err = os.Rename("squashfs-root", "FiddlerEverywhere")
	if err != nil {
		log.Fatalln("Rename squashfs error:", err)
	}
}
