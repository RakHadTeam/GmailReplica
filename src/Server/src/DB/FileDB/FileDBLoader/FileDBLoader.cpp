#include <DB/FileDB/FileDBLoader/FileDBLoader.h>

FileDBLoader::FileDBLoader(const std::string& dataFolderPath,const std::string& blacklistFileName,const std::string& arrayFileName)
: dataFolderPath(dataFolderPath), blacklistFileName(blacklistFileName), arrayFileName(arrayFileName) {
}

void FileDBLoader::loadURLs(std::vector<std::string>& URLarray) {
	std::ifstream inFile(dataFolderPath + "/" + blacklistFileName);

	if (!inFile.is_open()) {
		return;
	}

	std::string line;
	while (std::getline(inFile, line)) {
		if (!line.empty()) {
			URLarray.push_back(line);
		}
	}

	inFile.close();
}

bool FileDBLoader::loadArrayFilter(std::vector<bool>& bitArray) {
	std::ifstream inFile(dataFolderPath + "/" + arrayFileName);

	if (!inFile.is_open()) {
		return false;
	}

	std::vector<bool> tempArray;

	char bit;
	while (inFile >> bit) {
		if (bit == '0') tempArray.push_back(false);
		else if (bit == '1') tempArray.push_back(true);
		else {
			return false; // leave bitArray unchanged
		}
	}

	if (tempArray.size() != bitArray.size()) {
		return false; // leave bitArray unchanged
	}

	// if all good
	bitArray = tempArray;
	inFile.close();
	return true;
}
