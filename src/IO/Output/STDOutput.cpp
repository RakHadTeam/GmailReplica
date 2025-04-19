#include <iostream>
#include "IOutput.h"

class STDOutput : public IOutput {
public:
	// Implement the display method to show result based on bloom filter and real blacklist
	void displayCheckURLResult(bool arrayBitResult, bool falsePositiveResult) override {
		if (arrayBitResult) {
			if (falsePositiveResult) {
				std::cout << "true false" << std::endl; // False positive case
			}
			else {
				std::cout << "true true" << std::endl; // URL definitely in blacklist
			}
		}
		else {
			std::cout << "false" << std::endl; // Definitely not in blacklist
		}
	}
};
