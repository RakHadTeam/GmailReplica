#pragma once
#include <DB/IDBSaver.h>
#include <string>
#include <vector>
#include <filesystem>
#include <fstream>

class FileDBSaver : public IDBSaver {
private:
	const std::string dataFolderPath;
	const std::string blacklistFileName;
	const std::string arrayFileName;
public:
	FileDBSaver(const std::string& dataFolderPath,const std::string& blacklistFileName,const std::string& arrayFileName);
    void saveFilterArray(std::vector<bool>& bitArray) override;
	void saveURL(const std::string& url) override;

};