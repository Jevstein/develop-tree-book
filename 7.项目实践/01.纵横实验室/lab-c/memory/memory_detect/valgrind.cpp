/*
 *  valgrind.cpp 
 *  valgrind
 *
 *  Created by Jevstein on 2018/11/14 13:46.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <iostream>

char* getMemory()
{
	char *p = (char *)malloc(30);
	return p;
}

int main()
{
	printf("--------- memory detect ---------\n");

	char *p = getMemory();
	if (p != NULL)
	{
		//free(p);
		p = NULL;
	}


	char *p1 = new char[10];
	if (p1)
	{
		delete []p1;
	}

	printf("--------- the end ---------\n");

	return 0;
}

//compile:
// $ g++ -g -o ../../../bin/memory_detect valgrind.cpp
//
//run by valgrind:
// $ ./valgrind --tool=memcheck --leak-check=yes --show-reachable=yes ./memory_detect