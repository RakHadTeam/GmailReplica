#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <map>
#include "ICommand.h"

class App {
private:
	std::map<std::string, ICommand*> commands; // Map to store command objects

public:
	App(std::map<std::string, ICommand*>& commands) : commands(commands) {} // Constructor to initialize commands

	void run() {

		std::string task;
		while (true) {
			std::cin >> task;
			try {
				if (commands.find(task) == commands.end()) {
					std::cerr << "Error: Command not found." << std::endl;
					std::cin.clear(); // Clear the input stream
					std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // Ignore the rest of the input
					continue;
				}
				commands[task]->execute(); // Execute the command associated with the task
			} catch (const std::exception& e) {
				std::cerr << "Error: " << e.what() << std::endl;
				continue;
			}
		}

	}
};
