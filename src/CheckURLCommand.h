#include "ICommand.h"
#include <string>
#include "IInput.h"
#include <unordered_set>

// Command that checks if a given URL exists in the Bloom Filter
class CheckURLCommand : public ICommand {
private:
    BloomFilter& bloomFilter;
    IInput* input;
    const std::unordered_set<std::string>& realBlacklist;

public:
    // Constructor initializes members
    CheckURLCommand(BloomFilter& bloomFilter, IInput* input, const std::unordered_set<std::string>& blacklist)
        : bloomFilter(bloomFilter), input(input), realBlacklist(blacklist) {}

    void execute() override {
        std::string url;
        input->getURL(url);  // Get URL from input
        if (url.empty())
            return;

        // Check Bloom Filter
        if (bloomFilter.contains(url)) {
            // Check if it's a true or false positive
            if (realBlacklist.count(url)) {
                std::cout << "true true" << std::endl;
            } else {
                std::cout << "true false" << std::endl;
            }
        } else {
            std::cout << "false" << std::endl;  // Definitely not in blacklist
        }
    }
};