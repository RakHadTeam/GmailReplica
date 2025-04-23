#pragma once

#include <IO/Output/IOutput.h>
#include <iostream>

// The STDOutput class implements the IOutput interface to display results to the standard output.
class STDOutput : public IOutput {
public:
	// Display the result of checking a URL against the bloom filter and real blacklist
	void displayCheckURLResult(bool arrayBitResult, bool URLBlacklistResult) override;
};