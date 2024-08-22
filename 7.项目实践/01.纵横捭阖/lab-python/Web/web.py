#!/usr/bin/python
# -*- coding: utf-8 -*-

from git_repos import GitHubAnalyzer

def github_analyzer():
    ga = GitHubAnalyzer()
    ga.run()

def main():
    github_analyzer()

if __name__ == '__main__':
    main()
