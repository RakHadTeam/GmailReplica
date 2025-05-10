#include <DB/FileDB/FileDBSaver/FileDBSaver.h>

FileDBSaver::FileDBSaver(const std::string& dataFolderPath,const std::string& blacklistFileName,const std::string& arrayFileName)
	: dataFolderPath(dataFolderPath), blacklistFileName(blacklistFileName), arrayFileName(arrayFileName) {
	// Create the data folder if it doesn't exist
	if (!std::filesystem::exists(dataFolderPath)) {
		std::filesystem::create_directory(dataFolderPath);
	}
}

void FileDBSaver::saveFilterArray(std::vector<bool>& bitArray) {
	// Open the file in write mode
	// If the file doesn't exist, it will be created
	std::ofstream outFile(dataFolderPath + "/" + arrayFileName, std::ios::out);

	if (!outFile) {
		return;
	}

	for (bool bit : bitArray)
		outFile << (bit ? '1' : '0');
	
	outFile.close();
}

void FileDBSaver::saveURL(const std::string& url) {
	std::string fullPath = dataFolderPath + "/"+ blacklistFileName;
	std::ofstream outFile(fullPath, std::ios::app);

	if (!outFile.is_open()) {
		return;
	}


	outFile << url << std::endl;
	outFile.close();
}

#include <DB/FileDB/FileDBSaver/FileDBSaver.h>
#include <fstream>
#include <filesystem>

void FileDBSaver::deleteURL(const std::string& url) {
    namespace fs = std::filesystem;
    fs::path fullPath = fs::path(dataFolderPath) / blacklistFileName;
    fs::path tempPath = fullPath;
    tempPath += ".tmp";

    std::ifstream inFile(fullPath);
    if (!inFile.is_open()) return;

    std::ofstream outFile(tempPath, std::ios::trunc);
    if (!outFile.is_open()) {
        inFile.close();
        return;
    }

    std::string line;
    while (std::getline(inFile, line)) {
        if (!line.empty() && line.back() == '\r') line.pop_back();
        if (line == url) continue;
        outFile << line << "\n";
    }

    outFile.close();
    inFile.close();

    fs::rename(tempPath, fullPath);
}
