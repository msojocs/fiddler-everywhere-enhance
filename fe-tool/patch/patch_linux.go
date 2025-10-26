package patch

import (
	"bufio"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
)

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
	if s, err := os.Stat("cache/fiddler.so"); err == nil && !s.IsDir() {
		log.Println("cache/fiddler.so exists.")
		return
	}
	file, err := os.Create("cache/fiddler.so.tmp")
	if err != nil {
		log.Fatalln("Create file error:" + err.Error())
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	client := http.Client{}
	resp, err := client.Get("https://github.com/project-yui/Yui-patch/releases/download/v1.1.3/yui-libfiddler-linux-x86_64-v1.1.3.so")
	if err != nil {
		log.Fatalln("Download fiddler.so error:" + err.Error())
	}
	defer resp.Body.Close()

	fileSize, err := io.Copy(writer, resp.Body)

	if err != nil {
		log.Fatalln("Write file error:" + err.Error())
	}
	err = os.Rename("cache/fiddler.so.tmp", "cache/fiddler.so")
	if err != nil {
		log.Fatalln("Rename fiddler.so.tmp error", err)
	}
	log.Println("Download fiddler.so end, file size:", fileSize)
}

func replaceFiddler(version string) {

	os.Remove("FiddlerEverywhere/libfiddler.so")
	fiddlerFileDst, err := os.Create("FiddlerEverywhere/libfiddler.so")
	if err != nil {
		log.Fatalln("Open FiddlerEverywhere/libfiddler.so file error:", err)
	}
	defer fiddlerFileDst.Close()
	fiddlerFileSrc, err := os.Open("cache/fiddler.so")
	if err != nil {
		log.Fatalln("Open cache/fiddler.so file error:", err)
	}
	defer fiddlerFileSrc.Close()
	io.Copy(fiddlerFileDst, fiddlerFileSrc)
}
