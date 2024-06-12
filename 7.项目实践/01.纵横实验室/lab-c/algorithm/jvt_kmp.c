/*
 *  jvt_kmp.c 
 *  jvt_kmp
 *
 *  Created by Jevstein on 2019/01/30 07:20.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  KMP算法：
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

void jvt_kmp_makenext(const char *pattern, int *next);//生成next数组
int jvt_kmp_matcher(const char *text, const char *pattern, int *next);//返回匹配到第一个相同子串的索引
int jvt_kmp_matcher_all(const char *text, const char *pattern, int *next, int *idxs);//返回所有相同子串的索引

void jvt_kmp_make_next(const char *pattern, int *next) {
    int i;//下标
    int k;//相同的个数
    int l = strlen(pattern);

    for (i = 1, k = 0; i < l; i++) {
        //发现当前[i]与前缀最后一个字母[k]不同，后退再比较，循环直到退为0
        while ((k > 0) && (pattern[i] != pattern[k])){
            k = next[k-1];//前缀后退
        }

        //[i]与前缀[k]相同，前移继续比较
        if (pattern[i] == pattern[k])
            k++;

        next[i] = k;
    }
}

int jvt_kmp_matcher(const char *text, const char *pattern, int *next) {
    // matcher() 和 make_next()原理很像
    int m = strlen(text);
    int n = strlen(pattern);

    jvt_kmp_make_next(pattern, next);

    int i;
    int k;
    for (i = 0, k=0; i < m; i++) {
        while ((k > 0) && (text[i] != pattern[k])) {
            k = next[k-1];
        }

        if (text[i] == pattern[k])
            k++;

        if (k == n) {
			//printf("Pattern occurs with shift: %d\n", (i-n+1));
            return i-k+1;
        }
    }

    return -1;
}

int jvt_kmp_matcher_all(const char *text, const char *pattern, int *next, int *idxs) {
    // matcher() 和 make_next()原理很像
    int m = strlen(text);
    int n = strlen(pattern);

    jvt_kmp_make_next(pattern, next);

    int i;
    int k;
    int count = 0;
    for (i = 0, k = 0; i < m; i++) {
        while ((k > 0) && (text[i] != pattern[k])) {
            k = next[k-1];
        }

        if (text[i] == pattern[k])
            k++;

        if (k == n) {
			// printf("Pattern occurs with shift: %d\n", (i-n+1));
            idxs[count++] = i - k + 1;
            // k = 0;
            continue;
        } else {
			// printf("i=%d, k=%d, n=%d\n", i, k, n);
        }
    }

    return count;
}

int main () {
    int k, i, j, n;
	int next[20] = {0};
    int idxs[20] = {-1};

	char *text = "ababxbabababcdabdcadfdsss";
    char patterns[][20] = {"abababc", "ab", "a", "ababababc", "hehe"};

    printf("========= 1.init =========\n");
    printf("text: '%s'\n", text);
    for( k = 0; k < sizeof(patterns) / 20; k++)
    {
        printf("pattern[%d]: '%s'\n", k, patterns[k]);
    }
    

    printf("\n========= 2.matcher =========\n");
    for( k = 0; k < sizeof(patterns) / 20; k++)
    {
        int idx = jvt_kmp_matcher(text, patterns[k], next);
        if (idx < 0) {
            printf("failed to match pattern[%d]['%s'] from '%s'!\n", k, patterns[k], text);
        } else {
            printf("match pattern[%d]['%s']: object=[%d]['", k, patterns[k], idx);
            for (i = 0; i < strlen(patterns[k]); i++) {
                printf("%c", text[i + idx]);
            }
            printf("']\n");
        }
    }


    printf("\n========= 3.all matcher =========\n");
    for( k = 0; k < sizeof(patterns) / 20; k++)
    {
        n = jvt_kmp_matcher_all(text, patterns[k], next, idxs);
        if (n == 0) {
            printf("failed to match pattern[%d]['%s'] from '%s'!\n", k, patterns[k], text);
        } else {
            printf("match pattern[%d]['%s']: count=%d, objects=\n{\n", k, patterns[k], n);
            for (i = 0; i < n; i++) {
                printf("   [%d][%d]['", i, idxs[i]);
                for (j = 0; j < strlen(patterns[k]); j++) {
                    printf("%c", text[idxs[i] + j]);
                }
                printf("']\n");
            }
            printf("}\n");
        }
    }

    printf("\n========= 4.the end =========\n");
    printf("perfect!\n");


    return 0;
}