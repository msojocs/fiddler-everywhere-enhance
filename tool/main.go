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
	// 1.下载FE，解压
	sg := sync.WaitGroup{}
	sg.Add(3)
	go func() {
		fe.Download()
		fe.Extract()
		sg.Done()
	}()
	go func() {
		// 3.下载server数据，解压
		server.Download()
		server.Extract()
		sg.Done()
	}()
	go patch.Download(&sg)
	sg.Wait()
	// 4.patch
	patch.Apply()
}
