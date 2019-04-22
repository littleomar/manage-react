#货物后台管理系统（进销存）
>###系统特性
1. 代码整体架构采用服务端渲染，利于SEO优化。
2. 前端代码由目前主流框架React开发，用到主要组件有react-router对前端进行路由以及Mobx进行前端数据状态的存储。
3. 前端样式用Ant-Design开发，自己写的css代码较少。
4. 后台与前端Cookie结合记录用户登录状态，根据Cookie判断用户当前状态以便限制用户路由跳转。
5. 后台数据用nodejs进行处理，用Koa2搭建整体框架。
6. 数据库信息存储在线上，由ApiCloud提供服务。
7. 用pm2一键部署上线，静态资源发布到cdn进行加速，由七牛云提供服务，在服务器上由nginx做反向代理。