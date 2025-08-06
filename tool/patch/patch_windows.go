package patch

import (
	"bufio"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
)

func Download(sg *sync.WaitGroup) {
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
	if s, err := os.Stat("cache/fiddler.dll"); err == nil && !s.IsDir() {
		log.Println("cache/fiddler.dll exists.")
		sg.Done()
		return
	}
	file, err := os.Create("cache/fiddler.dll.tmp")
	if err != nil {
		log.Fatalln("Create file error:" + err.Error())
	}

	writer := bufio.NewWriter(file)
	client := http.Client{}
	resp, err := client.Get("https://github.com/project-yui/Yui-patch/releases/download/v1.1.3/yui-fiddler-win32-x86_64-v1.1.3.dll")
	if err != nil {
		file.Close()
		log.Fatalln("Download fiddler.dll error:" + err.Error())
	}
	defer resp.Body.Close()

	fileSize, err := io.Copy(writer, resp.Body)

	file.Close()
	if err != nil {
		log.Fatalln("Write file error:" + err.Error())
	}
	err = os.Rename("cache/fiddler.dll.tmp", "cache/fiddler.dll")
	if err != nil {
		log.Fatalln("Rename fiddler.dll.tmp error", err)
	}
	log.Println("Download end, file size:", fileSize)
	sg.Done()
}
func replaceFiddler() {

	os.Remove("FiddlerEverywhere/fiddler.dll")
	fiddlerFileDst, err := os.Create("FiddlerEverywhere/fiddler.dll")
	if err != nil {
		log.Fatalln("Open FiddlerEverywhere/fiddler.dll file error:", err)
	}
	defer fiddlerFileDst.Close()
	fiddlerFileSrc, err := os.Open("cache/fiddler.dll")
	if err != nil {
		log.Fatalln("Open cache/fiddler.dll file error:", err)
	}
	defer fiddlerFileSrc.Close()
	io.Copy(fiddlerFileDst, fiddlerFileSrc)
}
