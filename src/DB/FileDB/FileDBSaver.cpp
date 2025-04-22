#include "FileDBSaver.h"
#include <iostream>

FileDBSaver::FileDBSaver(const std::string& dataFolderPath)
	: dataFolderPath(dataFolderPath) {
	// Create the data folder if it doesn't exist
	if (!std::filesystem::exists(dataFolderPath)) {
		std::filesystem::create_directory(dataFolderPath);
	}
}

void FileDBSaver::saveFilterArray(std::vector<bool>& bitArray) {
	// Open the file in write mode
	// If the file doesn't exist, it will be created
	std::ofstream outFile(dataFolderPath + "/" + dataFileName, std::ios::out);

	if (!outFile) {
		return;
	}

	for (bool bit : bitArray)
		outFile << (bit ? '1' : '0');
	
	outFile.close();
}

void FileDBSaver::saveURL(const std::string& url) {
	std::string fullPath = dataFolderPath + "/blacklist";
	std::ofstream outFile(fullPath, std::ios::app);

	if (!outFile.is_open()) {
		return;
	}


	outFile << url << std::endl;
	outFile.close();
}


