#!/usr/bin/python
# -*- coding: utf-8 -*-

import requests
import pygal
from pygal.style import LightColorizedStyle as LCS, LightenStyle as LS

class GitHubAnalyzer(object):
    def __init__(self):
        print "git analyzer"

    def run(self):
        print ("1.get most-stars project on GitHub")
        self.get_moststars("Java")

        # print ("2.get information from HackerNews")
        # self.get_hackernews()

    def get_moststars(self, language):
        # 执行API调用并存储响应
        url = u"https://api.github.com/search/repositories?q=language:%s&sort=stars" % (language)
        r = requests.get(url)
        print("Status code:", r.status_code)
        # 将API响应存储在一个变量中
        response_dict = r.json()
        # 处理结果
        # print(response_dict.keys())

        print("Total repositories:", response_dict['total_count'])
        # 探索有关仓库的信息
        repo_dicts = response_dict['items']
        print("Repositories returned:", len(repo_dicts))
        # # 研究第一个仓库
        # repo_dict = repo_dicts[0]
        # # print("\nKeys:", len(repo_dict))
        # # for key in sorted(repo_dict.keys()):
        # #     print(key)
        # print("\nSelected information about first repository:")
        # print('Name:', repo_dict['name'])
        # print('Owner:', repo_dict['owner']['login'])
        # print('Stars:', repo_dict['stargazers_count'])
        # print('Repository:', repo_dict['html_url'])
        # print('Created:', repo_dict['created_at'])
        # print('Updated:', repo_dict['updated_at'])
        # print('Description:', repo_dict['description'])
        # # 研究所有仓库
        # for repo_dict in repo_dicts:
        #     print('\nName:', repo_dict['name'])
        #     print('Owner:', repo_dict['owner']['login'])
        #     print('Stars:', repo_dict['stargazers_count'])
        #     print('Repository:', repo_dict['html_url'])
        #     print('Description:', repo_dict['description'])
        # 可视化研究有关仓库的信息
        names, stars = [], []
        for repo_dict in repo_dicts:
            names.append(repo_dict['name'])
            # stars.append(repo_dict['stargazers_count'])
            # 自定义提示
            # stars.append({'value': int(repo_dict['stargazers_count']), 'label': u'%s' % (repo_dict['description'])})
            plot_dict = {
                'value': repo_dict['stargazers_count'],
                'label': u'%s' % (repo_dict['description']),
                'xlink': repo_dict['html_url'],
            }
            stars.append(plot_dict)
        # # 可视化
        # my_style = LS('#333366', base_style=LCS)
        # chart = pygal.Bar(style=my_style, x_label_rotation=45, show_legend=False)
        # chart.title = 'Most-Starred Python Projects on GitHub'
        # chart.x_labels = names
        # chart.add('', stars)
        # chart.render_to_file('python_repos.svg')
        # 可视化
        my_style = LS('#333366', base_style=LCS)
        my_config = pygal.Config()
        my_config.x_label_rotation = 45
        my_config.show_legend = False
        my_config.title_font_size = 24
        my_config.label_font_size = 14
        my_config.major_label_font_size = 18
        my_config.truncate_label = 15
        my_config.show_y_guides = False
        my_config.width = 1000
        chart = pygal.Bar(my_config, style=my_style)
        chart.title = 'Most-Starred %s Projects on GitHub' % language
        chart.x_labels = names
        chart.add('', stars)
        chart.render_to_file('%s_repos.svg' % language)

    def get_hackernews(self):
        # 执行API调用并存储响应
        url = 'https://hacker-news.firebaseio.com/v0/topstories.json'
        r = requests.get(url)
        print("Status code:", r.status_code)
        # 处理有关每篇文章的信息
        submission_ids = r.json()
        submission_dicts = []
        for submission_id in submission_ids[:30]:
            # 对于每篇文章，都执行一个API调用
            url = ('https://hacker-news.firebaseio.com/v0/item/' + str(submission_id) + '.json')
            submission_r = requests.get(url)
            print(submission_r.status_code)
            response_dict = submission_r.json()
            submission_dict = {
                'title': response_dict['title'],
                'link': 'http://news.ycombinator.com/item?id=' + str(submission_id),
                'comments': response_dict.get('descendants', 0)
            }
            submission_dicts.append(submission_dict)
            submission_dicts = sorted(submission_dicts, key=itemgetter('comments'), reverse=True)
        for submission_dict in submission_dicts:
            print("\nTitle:", submission_dict['title'])
            print("Discussion link:", submission_dict['link'])
            print("Comments:", submission_dict['comments'])