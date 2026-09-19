package patch

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/dcboy/go-asar/asar"
)

// Windows / Linux 通用补丁
const (
	webServerDir  = "FiddlerEverywhere/resources/app/out/WebServer"
	systemLinqUrl = "https://github.com/msojocs/dotnet-runtime-for-fildder/releases/download/v10.0.9-1/System.Linq.dll"
)

// DownloadCommon 下载 Windows / Linux 通用的补丁文件
func DownloadCommon() {
	log.Println("Downloading System.Linq.dll ......")
	err := download(systemLinqUrl, "cache/System.Linq.dll")
	if err != nil {
		log.Fatalln("Download System.Linq.dll error:", err)
	}
}

// download 下载 link 到 saveFilePath，文件已存在时跳过
func download(link string, saveFilePath string) error {
	if s, err := os.Stat(saveFilePath); err == nil && !s.IsDir() {
		log.Println(saveFilePath + " exists.")
		return nil
	}
	tmpPath := saveFilePath + ".tmp"
	file, err := os.Create(tmpPath)
	if err != nil {
		return err
	}
	// 出错时关闭并删除临时文件
	defer func() {
		file.Close()
		if err != nil {
			os.Remove(tmpPath)
		}
	}()

	client := http.Client{}
	resp, err := client.Get(link)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	writer := bufio.NewWriter(file)
	fileSize, err := io.Copy(writer, resp.Body)
	if err != nil {
		return err
	}
	if err = writer.Flush(); err != nil {
		return err
	}
	if err = file.Close(); err != nil {
		return err
	}
	if err = os.Rename(tmpPath, saveFilePath); err != nil {
		return err
	}
	log.Println("Download "+saveFilePath+" end, file size:", fileSize)
	return nil
}

// replaceSystemLinq 替换 WebServer 下的 System.Linq.dll
func replaceSystemLinq() {
	target := webServerDir + "/System.Linq.dll"
	if _, err := os.Stat(target); err != nil {
		log.Println(target + " not found, skip.")
		return
	}
	log.Println("Replace:", target)
	os.Remove(target)
	dst, err := os.Create(target)
	if err != nil {
		log.Fatalln("Open "+target+" file error:", err)
	}
	defer dst.Close()
	src, err := os.Open("cache/System.Linq.dll")
	if err != nil {
		log.Fatalln("Open cache/System.Linq.dll file error:", err)
	}
	defer src.Close()
	_, err = io.Copy(dst, src)
	if err != nil {
		log.Fatalln("Copy System.Linq.dll error:", err)
	}
}

func Apply(version string) {
	log.Println("Apply patch.")

	// if file exists
	if _, err := os.Stat("FiddlerEverywhere/resources/app.asar"); err == nil {
		os.WriteFile("FiddlerEverywhere/resources/app.asar.unpacked/NOTICES-reporter.txt", []byte(""), 0644)
		err := asar.ExtractAll("FiddlerEverywhere/resources/app.asar", "FiddlerEverywhere/resources/app")
		if err != nil {
			log.Fatalln("Extract app.asar error:", err)
		}

		os.RemoveAll("FiddlerEverywhere/resources/app.asar")
	}
	os.RemoveAll("FiddlerEverywhere/resources/app/out/file")
	// 2. Copy server/file -> fe/resources/app/out/file
	err := os.Rename("fiddler-everywhere-enhance-8.x/server/file", "FiddlerEverywhere/resources/app/out/file")
	if err != nil {
		log.Fatalln("Move server file error:", err)
	}
	// 3. Copy fe/resources/app/out/main.js to fe/resources/app/out/main.original.js
	err = os.Rename("FiddlerEverywhere/resources/app/out/main.js", "FiddlerEverywhere/resources/app/out/main.original.js")
	if err != nil {
		log.Fatalln("Rename main.js to main.original.js error:", err)
	}
	// 4. Prepend server/index.js to fe/resources/app/out/main.js
	err = os.Rename("fiddler-everywhere-enhance-8.x/server/index.js", "FiddlerEverywhere/resources/app/out/main.js")
	if err != nil {
		log.Fatalln("Move server/index.js to main.js error:", err)
	}
	mainFile, err := os.OpenFile("FiddlerEverywhere/resources/app/out/main.js", os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalln("Open main.js file error:", err)
	}
	defer mainFile.Close()

	originalFile, err := os.Open("FiddlerEverywhere/resources/app/out/main.original.js")
	if err != nil {
		log.Fatalln("Open main.original.js file error:", err)
	}
	defer originalFile.Close()

	log.Println("Append main.js")
	_, err = io.Copy(mainFile, originalFile)
	if err != nil {
		log.Fatalln("Append main.js error:", err)
	}

	os.Chmod(webServerDir+"/Fiddler.WebUi", 0755)

	replaceFiddler(version)
	replaceSystemLinq()
	log.Println("Apply end.")
}
