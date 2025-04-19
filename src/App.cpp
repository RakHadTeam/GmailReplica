#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <map>
#include "ICommand.h"

class App {
private:
	std::map<std::string, std::shared_ptr<ICommand>> commands; // Map to store command objects

public:
	App(std::map<std::string, std::shared_ptr<ICommand>>& commands) : commands(commands) {} // Constructor to initialize commands

	void run() {

		std::string task;
		while (true) {
			std::cin >> task;
			try {
				commands.at(task)->execute();
			}
			catch (...) {
				continue;
			}
		}

	}
};
