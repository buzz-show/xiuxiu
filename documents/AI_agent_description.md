
# 宠物 AI 医生 Agent（LangGraph版）MVP 架构蓝图

目标是：**4 周内做出一个可运行的 AI 宠物医疗问答系统**，重点训练你做 **Agent + RAG + LangGraph**。

我会按工程视角拆成 6 个部分：

1. LangGraph Agent 架构
2. LangGraph 节点设计
3. Prompt 设计
4. RAG 知识库结构
5. 数据库设计
6. API 设计
7. MVP 开发顺序

技术栈建议：

```
Frontend
Vue3 / Nuxt

Backend
Node.js

AI
LangGraph

Vector DB
pgvector (Supabase)

LLM
Qwen / OpenAI
```

---

# 一、整体系统架构

系统核心是一个 **宠物医疗 Agent**。

```
用户
 ↓
API Gateway
 ↓
Pet AI Agent (LangGraph)
 ↓
 ├─ 症状分析
 ├─ RAG医学检索
 ├─ 追问症状
 ├─ 风险评估
 └─ 给出建议
 ↓
返回回答
```

系统组件：

```
APP
 │
 │ HTTP
 ▼
Backend API
 │
 │ 调用
 ▼
LangGraph Agent
 │
 ├── LLM
 ├── Vector DB
 └── Pet Profile
```

---

# 二、LangGraph Agent 设计

核心思想：

**把 AI 问诊拆成多个节点**

LangGraph workflow：

```
START
 ↓
Intent识别
 ↓
症状提取
 ↓
是否信息充足？
 ├─ 否 → 追问
 └─ 是
 ↓
RAG医学检索
 ↓
风险评估
 ↓
生成建议
 ↓
END
```

---

# 三、LangGraph 节点设计

### 1 Intent识别节点

作用：

判断用户问题类型。

分类：

```
symptom_question
food_question
behavior_question
general_question
```

示例：

输入

```
狗一直吐
```

输出

```
intent: symptom_question
animal: dog
```

---

### 2 症状提取节点

从用户输入提取：

```
动物
年龄
症状
持续时间
严重程度
```

Example

输入：

```
我的狗昨天开始一直吐
```

输出：

```
animal: dog
symptom: vomiting
duration: 1 day
severity: unknown
```

---

### 3 追问节点

如果症状信息不足：

AI生成追问问题。

Example

```
狗有发烧吗？
是否吃了异物？
是否腹泻？
```

LangGraph循环：

```
用户回答
 ↓
重新分析
```

---

### 4 RAG医学检索节点

输入：

```
symptom = vomiting
animal = dog
```

向 vector db 查询：

```
犬 呕吐 原因
犬 呕吐 处理
```

返回医学知识。

---

### 5 风险评估节点

输出：

```
low risk
medium risk
high risk
```

规则：

```
连续呕吐 > 24h
带血
精神萎靡
```

高风险。

---

### 6 建议生成节点

输出结构化结果：

```
诊断可能
风险等级
家庭护理建议
是否需要就医
```

Example

```
可能原因：
肠胃炎
饮食不当

建议：
禁食12小时
补充水

如果持续呕吐
建议就医
```

---

# 四、Prompt 设计

## 1 System Prompt

AI扮演角色：

```
你是一名宠物医生助手。
你的目标是帮助宠物主人判断宠物健康问题。

规则：

1 不要给出确定诊断
2 必须提示就医风险
3 优先保护宠物安全
4 回答要简洁
```

---

## 2 症状提取 Prompt

```
提取以下信息：

animal
symptom
duration
severity

输入：

{user_input}

输出 JSON
```

Example

```
{
animal: dog
symptom: vomiting
duration: 1 day
severity: unknown
}
```

---

## 3 风险评估 Prompt

输入：

```
symptom
duration
extra symptoms
```

输出：

```
risk_level
reason
```

---

# 五、RAG 知识库结构

知识来源：

```
宠物医学教材
兽医网站
宠物医院科普
```

文档切分：

```
300 tokens
```

Example chunk：

```
犬呕吐常见原因：

1 饮食问题
2 胃炎
3 中毒
```

---

Vector DB：

使用

```
pgvector
```

表：

```
knowledge_chunks
```

字段：

```
id
content
embedding
animal
symptom
source
```

---

检索策略：

```
top_k = 5
```

---

# 六、数据库结构

使用：

**Supabase Postgres**

核心表：

---

### user

```
id
email
created_at
```

---

### pets

```
id
user_id
name
species
breed
age
weight
```

---

### medical_records

```
id
pet_id
date
symptom
diagnosis
treatment
```

---

### chat_sessions

```
id
user_id
pet_id
created_at
```

---

### chat_messages

```
id
session_id
role
content
timestamp
```

---

# 七、API设计

### 创建聊天

POST

```
/api/chat/start
```

返回

```
session_id
```

---

### 发送消息

POST

```
/api/chat/message
```

body

```
session_id
message
```

返回

```
assistant_reply
risk_level
```

---

### 查询聊天记录

GET

```
/api/chat/history
```

---

# 八、LangGraph 代码结构

推荐目录：

```
ai-agent
 ├─ graph
 │   ├─ workflow.ts
 │   ├─ nodes
 │   │   ├─ intent.ts
 │   │   ├─ symptom_extract.ts
 │   │   ├─ followup.ts
 │   │   ├─ rag_search.ts
 │   │   ├─ risk_assess.ts
 │   │   └─ advice.ts
 │
 ├─ prompts
 │   ├─ system.ts
 │   ├─ symptom.ts
 │
 ├─ rag
 │   ├─ vector.ts
 │   ├─ ingest.ts
 │
 └─ api
     ├─ chat.ts
```

---

# 九、MVP 开发顺序（非常关键）

建议 **四周计划**。

---

## 第1周

做最小 AI chat

任务：

```
LangGraph HelloWorld
Chat API
LLM接入
```

实现：

```
用户问
AI回答
```

---

## 第2周

做 **症状问诊 Agent**

实现：

```
intent识别
症状提取
追问
```

---

## 第3周

做 **RAG知识库**

实现：

```
医学知识导入
向量检索
```

---

## 第4周

做 **风险评估 + UI**

实现：

```
风险等级
建议生成
前端聊天UI
```

---

# 十、最终 MVP 功能

最终用户可以：

```
1 创建宠物档案
2 AI问诊
3 追问症状
4 风险提示
5 就医建议
```

---

# 十一、未来升级方向（非常重要）

MVP之后可以升级：

### 1 图片识别

皮肤病识别

### 2 智能健康档案

自动总结：

```
年度健康报告
```

### 3 多Agent

```
医疗Agent
饮食Agent
行为Agent
```

---
