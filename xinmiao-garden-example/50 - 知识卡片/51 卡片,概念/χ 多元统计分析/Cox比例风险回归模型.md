---
标题: COX回归模型
创建时间: 2023-03-29 15:36
修改时间: <%+ tp.file.last_modified_date() %>
其他:
tags: 多元统计分析
类型1: "卡片"
类型2: "多元统计分析"
类型3: "模型"
用途: 模板
定位: 专注/关注
---
标签

```ad-info
title: <u></u>**描述**
collapse: open
color: 233, 244, 240

**◀️ 父节点| ▶️ 子节点** 

🪁 status: #🌸  
🎏 class: #📥 #📇  

description :: COX回归模型，又称“比例风险回归模型(proportional hazards model，简称Cox模型)”，是由英国统计学家D.R.Cox(1972)年提出的一种半参数回归模型。该模型以生存结局和生存时间为因变量，可同时分析众多因素对生存期的影响，能分析带有截尾生存时间的资料，且不要求估计资料的生存分布类型。由于上述优良性质，该模型自问世以来，在医学随访研究中得到广泛的应用，是迄今生存分析中应用最多的多因素分析方法

用于:: 

英文名:: proportional hazards model, Cox regression model
中文名::   Cox比例风险回归模型, COX回归模型

学科::  统计学

特点:: 

本质:: 

提出人:: D.R.Cox

来源:: [COX回归模型_百度百科 (baidu.com)](https://baike.baidu.com/item/COX%E5%9B%9E%E5%BD%92%E6%A8%A1%E5%9E%8B?fromModule=lemma_search-box)

📎

```

## 基本概念

在介绍Cox回归模型之前，先介绍几个有关的概念。

**1.生存函数**具有变量$X=\left(X_{1}, X_{2}, \ldots, X_{m}\right)$的观察对象的生存时间T大于某时刻t的概率，$S(t, X)=P(T>t, X)$称为[生存函数](https://baike.baidu.com/item/%E7%94%9F%E5%AD%98%E5%87%BD%E6%95%B0?fromModule=lemma_inlink)。生存函数$S(t, X)$又称为**累积生存率**。

**2. 死亡函数**具有变量X的观察对象的生存时间T不大于某时刻t的概率，$F(t, X)=P(T \leq t, X)$称为死亡函数。死亡函数F(t,X)的实际意义是当观察随访到t时刻的累积死亡率。

**3. 死亡密度函数**具有变量X的观察对象在某时刻t的瞬时死亡率，称为死亡密度函数。

$$f(t, X)=\lim _{\Delta t \rightarrow 0} \frac{P(t<T \leq t+\Delta t, X)}{\Delta t}=F^{\prime}(t, X)$$

**4. 危险率(风险)函数**具有变量X，且生存时间已达到t的观察对象在时刻t的瞬时死亡率，

$$h(t, X)=\lim _{\Delta t \rightarrow 0} \frac{P(t<T \leq t+\Delta t \mid T \geq t, X)}{\Delta t}=\frac{f(t, X)}{S(t, X)}$$

[危险率函数](https://baike.baidu.com/item/%E5%8D%B1%E9%99%A9%E7%8E%87%E5%87%BD%E6%95%B0?fromModule=lemma_inlink)h(t,X)实际上是一个条件瞬间死亡率 [2]  。

## 基本原理

生存分析的主要目的在于研究变量X与观察结果即[生存函数](https://baike.baidu.com/item/%E7%94%9F%E5%AD%98%E5%87%BD%E6%95%B0?fromModule=lemma_inlink)(累积生存率)S(t,X)之间的关系。当S(t,X)受很多因素影响，即$X=\left(X_{1}, \ldots, X_{m}\right)$为向量时，传统的方法是考虑回归方程——即诸变量X<sub>i</sub>对S(t,X)的影响。但由于生存分析研究中的数据包含删失数据。且时间变量t通常不满足正态分布和方差齐性的要求，这就造成了用一般的回归方法研究上述关系的困难 [2]  。

Cox回归模型的基本形式

D.R.Cox提出了Cox比例风险回归模型，它不是直接考察S(t,X) 与X的关系，而是用h(t,X)作为因变量，模型的基本形式为：
$$h(t, X)=h_{0}(t) \exp \left(\beta_{1} X_{1}+\beta_{2} X_{2}+\cdots+\beta_{m} X_{m}\right)$$

式中，$\beta_{1}, \beta_{2}, \ldots, \beta_{m}$为自变量的[偏回归系数](https://baike.baidu.com/item/%E5%81%8F%E5%9B%9E%E5%BD%92%E7%B3%BB%E6%95%B0/585287?fromModule=lemma_inlink)，它是须从样本数据作出估计的参数；h<sub>0</sub>(t)是当X向量为0时，h(t,X)的基准危险率，它是有待于从样本数据作出估计的量。公式(1)简称为**Cox回归模型**。

由于Cox回归模型对h<sub>0</sub>(t)未作任何假定，因此Cox回归模型在处理问题时具有较大的灵活性；另一方面，在许多情况下，我们只需估计出参数β (如因素分析等)，即使在h<sub>0</sub>(t)未知的情况下，仍可估计出参数β。这就是说，Cox回归模型由于含有h<sub>0</sub>(t)，因此它不是完全的参数模型，但仍可根据公式(1)作出参数β的估计，故Cox回归模型属于**半参数模型**。
<sub>
公式(1)可以转化为：</sub>
$$\ln \left[h(t, X) / h_{0}(t)\right]=\ln R R=\beta_{1} X_{1}+\beta_{2} X_{2}+\ldots+\beta_{m} X_{m}$$
Cox回归模型的假定

**1. 比例风险假定** 各危险因素的作用不随时间的变化而变化，即$h(t, X) / h_{0}(t)$不随时间的变化而变化。因此，公式(1)又称为**比例风险率模型**(PH Model)。这一假定是建立Cox回归模型的前提条件。

**2．对数线性假定** 模型中的协变量应与对数风险比呈线性关系，如公式(2)。

Cox回归模型中偏回归系数的意义

若X<sub>j</sub>是非暴露组观察对象的各因素取值，X<sub>i</sub>是暴露组观察对象的各因素取值，由公式(3)就可以求出暴露组对非暴露组的[相对危险度](https://baike.baidu.com/item/%E7%9B%B8%E5%AF%B9%E5%8D%B1%E9%99%A9%E5%BA%A6/6522377?fromModule=lemma_inlink)RR。

$$R R=\frac{h\left(t, X_{i}\right)}{h\left(t, X_{j}\right)}=\frac{h_{0}(t) \exp \beta^{\prime} X_{i}}{h_{0}(t) \exp \beta^{\prime} X_{j}}=\exp \left[\beta^{\prime}\left(X_{i}-X_{j}\right)\right], i, j=1,2, \ldots, m$$

由公式(2)可见，模型中偏回归系数β<sub>j</sub>的流行病学含义是在其他协变量不变的情况下，协变量$X_{j}(j=1,2, \ldots, m)$

 每增加一个测定单位时所引起的相对危险度的自然对数的改变量。即

$$R R_{j}=\exp \left[\beta_{j}\left(X_{j}-X_{j}^{*}\right)\right]$$

式中，$X_{j}, X_{j}^{*}$分别表示在不同情况下的取值。当协变量$X_{j}, X_{j}^{*}$分别取1和0时，其对应的RR<sub>j</sub>为

$$R R_{j}=\exp \left(\beta_{j}\right)$$

从公式(1)和公式(4)可以看出有如下关系：

若$\beta_{j}>0, R R_{j}>1$，则各X<sub>j</sub>取值越大时，h(t,X)的值越大，即X<sub>j</sub>为危险因素。

若$\beta_{j}=0, R R_{j}=1$ ，则各X<sub>j</sub>的取值对h(t,X)的值没有影响，即X<sub>j</sub>为无关因素。

若$\beta_{j}<0, R R_{j}<1$  ，则各X<sub>j</sub>取值越大时，h(t,X)的值越小，即X<sub>j</sub>为保护因素。

## 假设检验

编辑 播报

Cox回归模型中的偏回归系数可以通过建立偏似然函数，利用Newton-Raphson迭代法求得。其他自变量不变的情况下，变量X<sub>j</sub>每增加一个单位，相对危险度$R R_{j}$的(1-α)可信区间为：

$$\exp \left(\beta_{j} \pm Z_{\alpha / 2} S_{\beta_{j}}\right)$$

式中$S_{\beta_{j}}$为β<sub>j</sub>的标准误。

对于回归模型的假设检验通常采用[似然比检验](https://baike.baidu.com/item/%E4%BC%BC%E7%84%B6%E6%AF%94%E6%A3%80%E9%AA%8C/18278332?fromModule=lemma_inlink)、Wald检验和记分检验，其[检验统计量](https://baike.baidu.com/item/%E6%A3%80%E9%AA%8C%E7%BB%9F%E8%AE%A1%E9%87%8F/5850402?fromModule=lemma_inlink)均服从$\chi^{2}$分布，其自由度为模型中待检验的自变量个数。一般说来，Cox回归系数的估计和模型的假设检验计算量较大，通常需利用计算机来完成相应的计算 [2]  。

```ad-note
title: Relavant Note
collapse: open
color: 142, 106, 120
- 其他笔记也有提及到：
- 子节点：
```