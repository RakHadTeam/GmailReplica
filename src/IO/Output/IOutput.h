#pragma once

class IOutput {
public:
	virtual void displayCheckURLResult(bool arrayBitResult, bool URLBlacklistResult) = 0;
};