#ifndef IOUTPUT_H
#define IOUTPUT_H
class IOutput {
public:
	virtual void displayCheckURLResult(bool arrayBitResult, bool falsePositiveResult) = 0;
};

#endif // IOUTPUT_H
