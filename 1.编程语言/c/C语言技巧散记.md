[TOC]

# C语言技巧散记

## 1. 字符串数组遍历

```c
static char *emojis__[] = { ":smile:", ":smirk:", ":sweat_smile:", ":laughing:", ":v:" };
const int count = sizeof(emojis__) / sizeof(emojis__[0]);
char **p = emojis__;
for (int i = 0; i < count; i++, p++)
{
	printf("%s ", *p);
}
```

