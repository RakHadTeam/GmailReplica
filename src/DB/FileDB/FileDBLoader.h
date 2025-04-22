#pragma once
#include "../IDBLoader.h"
#include <string>
#include <vector>
#include <filesystem>
#include <fstream>

class FileDBLoader : public IDBLoader {
private:
	std::string dataFolderPath;
	const std::string dataFileName = "filter_array.txt";
public:
	FileDBLoader(const std::string& dataFolderPath);
	bool loadArrayFilter(std::vector<bool>& bitArray);
};