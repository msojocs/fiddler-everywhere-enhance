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

func Apply() {
	log.Println("Apply patch.")
	os.RemoveAll("FiddlerEverywhere/resources/app/out/file")
	// 2. Copy server/file -> fe/resources/app/out/file
	err := os.Rename("fiddler-everywhere-enhance-main/server/file", "FiddlerEverywhere/resources/app/out/file")
	if err != nil {
		log.Fatalln("Move server file error:", err)
	}
	// 3. Copy fe/resources/app/out/main.js to fe/resources/app/out/main.original.js
	err = os.Rename("FiddlerEverywhere/resources/app/out/main.js", "FiddlerEverywhere/resources/app/out/main.original.js")
	if err != nil {
		log.Fatalln("Rename main.js to main.original.js error:", err)
	}
	// 4. Prepend server/index.js to fe/resources/app/out/main.js
	err = os.Rename("fiddler-everywhere-enhance-main/server/index.js", "FiddlerEverywhere/resources/app/out/main.js")
	if err != nil {
		log.Fatalln("Move server/index.js to main.js error:", err)
	}
	mainFile, err := os.OpenFile("FiddlerEverywhere/resources/app/out/main.js", os.O_APPEND, 0644)
	if err != nil {
		log.Fatalln("Open main.js file error:", err)
	}
	defer mainFile.Close()

	originalFile, err := os.Open("FiddlerEverywhere/resources/app/out/main.original.js")
	if err != nil {
		log.Fatalln("Open main.original.js file error:", err)
	}
	defer originalFile.Close()
	io.Copy(mainFile, originalFile)

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
	log.Println("Apply end.")
}

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
