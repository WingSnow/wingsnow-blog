---
home: true
heroImage: /avatar.png
# actions:
#   - text: Get Started
#     link: /guide/getting-started.html
#     type: primary
footer:  ©2022 by @WingSnow
---

<div class="external">
  <typer-text :texts="texts" />
</div>

<script setup>
  const texts = [
    `这里是冬天吃雪糕的博客<用于记录我日常摸鱼中写下的文章`
  ]

</script>

<style>
.external {
  width: 50vw;
  margin: auto;
  text-align: center;
}

</style>
