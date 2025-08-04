package main

import (
	"fe-tool/fe"
	"fe-tool/patch"
	"fe-tool/server"
)

func main() {
	// 1.下载FE，解压
	fe.Download()
	server.Download()
	patch.Download()
	fe.Extract()
	// 3.下载server数据，解压
	server.Extract()
	// 4.patch
	patch.Apply()
}
