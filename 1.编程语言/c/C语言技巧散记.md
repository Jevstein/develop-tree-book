[TOC]

# C语言技巧散记

## 1. 字符串数组遍历

```c
static char *emojis__[] = { ":smile:", ":smirk:", ":sweat_smile:", ":laughing:", ":v:" };
char **p = emojis__;
const int count = sizeof(emojis__) / sizeof(emojis__[0]);
for (int i = 0; i < count; i++)
{
	printf("%s ", *(p + i));
}
```

