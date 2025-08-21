package main

import (
	"errors"
	"fe-tool/fe"
	"fe-tool/patch"
	"fe-tool/server"
	"log"
	"os"
	"sync"
)

func main() {
	// 0.准备文件夹
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

	sg := sync.WaitGroup{}
	sg.Add(3)
	go func() {
		// 1.下载FE，解压
		log.Println("Downloading FE ......")
		fe.Download()
		fe.Extract()
		sg.Done()
	}()
	go func() {
		// 2.下载server数据，解压
		log.Println("Downloading server ......")
		server.Download()
		server.Extract()
		sg.Done()
	}()
	// 3. 下载fiddler.dll
	go func() {
		log.Println("Downloading fiddler.dll ......")
		patch.Download()
		sg.Done()
	}()

	// 等待下载与解压任务全部完成
	sg.Wait()
	// 4.patch
	patch.Apply()
}
