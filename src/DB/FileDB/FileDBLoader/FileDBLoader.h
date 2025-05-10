#pragma once
#include <DB/IDBLoader.h>
#include <string>
#include <vector>
#include <filesystem>
#include <iostream>
#include <fstream>

class FileDBLoader : public IDBLoader {
private:
const std::string dataFolderPath;
const std::string blacklistFileName;
const std::string arrayFileName;
public:
	FileDBLoader (const std::string& dataFolderPath,const std::string& blacklistFileName,const std::string& arrayFileName);
	bool loadArrayFilter(std::vector<bool>& bitArray) override;
	void loadURLs(std::vector<std::string>& URLarray) override;
};