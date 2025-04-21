#pragma once
#include "../IDBSaver.h"

class FileDBSaver : public IDBSaver {
private:
	std::string filterArrayPath;
    std::string blacklistPath;
public:
	FileDBSaver(const std::string& filterArrayPath, const std::string& blacklistPath);
    void saveFilterArray(std::vector<bool>& bitArray);
};