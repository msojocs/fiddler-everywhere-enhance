package main

import (
	"errors"
	"fe-tool/fe"
	"fe-tool/patch"
	"fe-tool/server"
	"flag"
	"log"
	"os"
	"sync"
)

type FlagConfig struct {
	Version string
}

// 1. 声明保存命令行参数的变量
var config FlagConfig

func init() {
	// 2. 注册需要解析的命令行参: 参数名、默认值、参数说明
	flag.StringVar(&config.Version, "version", "latest", "Version of FE to download, e.g. 1.0.0")

	// 3. 解析命令行参数
	flag.Parse()
}

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
		p := fe.Download(config.Version)
		fe.Extract(p)
		sg.Done()
	}()
	go func() {
		// 2.下载server数据，解压
		log.Println("Downloading server ......")
		server.Download()
		server.Extract()
		sg.Done()
	}()
	// 3. 下载fiddler补丁
	go func() {
		log.Println("Downloading fiddler ......")
		patch.Download()
		sg.Done()
	}()

	// 等待下载与解压任务全部完成
	sg.Wait()
	// 4.patch
	patch.Apply()
}
