package patch

import (
	"io"
	"log"
	"os"
)

func Download() {
	log.Println("Downloading fiddler.so ......")
	err := download("https://github.com/project-yui/Yui-patch/releases/download/v1.1.3/yui-libfiddler-linux-x86_64-v1.1.3.so", "cache/fiddler.so")
	if err != nil {
		log.Fatalln("Download fiddler.so error:", err)
	}
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
