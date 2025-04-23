#pragma once
#include "../IDBSaver.h"
#include <string>
#include <vector>
#include <filesystem>
#include <fstream>

class FileDBSaver : public IDBSaver {
private:
	std::string dataFolderPath;
	const std::string blacklistFileName;
	const std::string arrayFileName;
public:
	FileDBSaver(const std::string& dataFolderPath,const std::string& blacklistFileName,const std::string& arrayFileName);
    void saveFilterArray(std::vector<bool>& bitArray);
	void saveURL(const std::string& url) override;

};