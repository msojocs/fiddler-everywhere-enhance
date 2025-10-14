package common

import (
	"archive/zip"
	"bufio"
	"io"
	"log"
	"os"
	"path"
	"path/filepath"
)

func extractZipFile(file *zip.File, targetDir string) error {
	rc, err := file.Open()
	if err != nil {
		return err
	}
	defer rc.Close()

	// Extract the file
	// log.Println("Extract:", file.Name)

	// 1. 创建文件夹
	dir := filepath.Dir(file.Name)
	err = os.MkdirAll(path.Join(targetDir, dir), 0755)
	if err != nil {
		log.Fatalln("Create dir error:", err)
	}
	if file.Name[len(file.Name)-1] == '\\' || file.Name[len(file.Name)-1] == '/' {
		// log.Println("Extract target is dir, skip.")
		return nil
	}
	// 2. 创建文件
	f, err := os.Create(path.Join(targetDir, file.Name))
	if err != nil {
		log.Fatalln("File create error:", err)
	}
	defer f.Close()

	// 3. 写入文件
	fw := bufio.NewWriter(f)
	_, err = io.Copy(fw, rc)
	if err != nil {
		log.Fatalln("Extract file error:", err)
	}
	// log.Println("Extract file ok [", cnt, "]:", file.Name)
	// 4. 关闭

	return nil
}

func ExtractZipArchive(archive string, targetDir string) error {
	r, err := zip.OpenReader(archive)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		if err = extractZipFile(f, targetDir); err != nil {
			return err
		}
	}

	return nil
}
