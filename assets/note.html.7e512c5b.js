import{_ as n}from"./plugin-vue_export-helper.21dcd24c.js";import{o as s,c as a,a as e}from"./app.b12f069c.js";const t={},p=e(`<h1 id="\u4EE3\u7801\u5C0F\u8BB0\u{1F425}" tabindex="-1"><a class="header-anchor" href="#\u4EE3\u7801\u5C0F\u8BB0\u{1F425}" aria-hidden="true">#</a> \u4EE3\u7801\u5C0F\u8BB0\u{1F425}</h1><h2 id="js\u751F\u6210\u7EAF\u6570\u5B57\u5E8F\u5217\u6570\u7EC4" tabindex="-1"><a class="header-anchor" href="#js\u751F\u6210\u7EAF\u6570\u5B57\u5E8F\u5217\u6570\u7EC4" aria-hidden="true">#</a> js\u751F\u6210\u7EAF\u6570\u5B57\u5E8F\u5217\u6570\u7EC4</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// \u751F\u62100-9</span>
Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token comment">// &gt; [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]</span>

<span class="token comment">// \u751F\u62101-10</span>
Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token comment">// &gt; [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</span>

<span class="token comment">// \u751F\u621010\u4E2A\u8FDE\u7EED\u7684\u5076\u6570</span>
Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">x</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> x<span class="token operator">*</span><span class="token number">2</span><span class="token punctuation">)</span>
<span class="token comment">// &gt; [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="gitignore\u4E0D\u8D77\u4F5C\u7528" tabindex="-1"><a class="header-anchor" href="#gitignore\u4E0D\u8D77\u4F5C\u7528" aria-hidden="true">#</a> .gitignore\u4E0D\u8D77\u4F5C\u7528</h2><p><code>.gitignore</code>\u53EA\u5BF9\u672A\u8DDF\u8E2A\u7684\u6587\u4EF6\u8D77\u4F5C\u7528\u3002\u5982\u679C\u4E00\u4E2A\u6587\u4EF6\u4E4B\u524D\u5DF2\u7ECF\u63D0\u4EA4\u8FC7\uFF0C\u90A3\u4E48\u540E\u9762\u5373\u4F7F\u628A\u5B83\u52A0\u5165\u5230<code>.gitignore</code>\u4E2D\u4E5F\u4E0D\u4F1A\u8D77\u4F5C\u7528\u3002</p><p>\u89E3\u51B3\u65B9\u6848\u662F\u6E05\u9664\u6389\u672C\u5730\u9879\u76EE\u7684git\u7F13\u5B58\uFF0C\u901A\u8FC7\u91CD\u65B0\u521B\u5EFAgit\u7D22\u5F15\u7684\u65B9\u5F0F\u6765\u751F\u6210\u9075\u4ECE\u65B0.gitignore\u6587\u4EF6\u4E2D\u89C4\u5219\u7684\u672C\u5730git\u7248\u672C\uFF0C\u518D\u91CD\u65B0\u63D0\u4EA4\u3002</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 0. \u8FDB\u5165\u9879\u76EE\u8DEF\u5F84</span>
<span class="token comment"># 1. \u6E05\u9664\u672C\u5730\u5F53\u524D\u7684Git\u7F13\u5B58</span>
<span class="token comment"># \u4E5F\u53EF\u4EE5\u53EA\u6E05\u695A\u9700\u8981\u5FFD\u7565\u7684\u6587\u4EF6\u7684\u7F13\u5B58\uFF0C\u5982\`git rm --cached -r dist\`\uFF0C\u8FD9\u6837\u5C31\u4E0D\u9700\u8981\u6267\u884C\u7B2C2\u6B65\u4E86</span>
<span class="token function">git</span> <span class="token function">rm</span> -r --cached <span class="token builtin class-name">.</span>

<span class="token comment"># 2. \u5E94\u7528.gitignore\u7B49\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u91CD\u65B0\u5EFA\u7ACBGit\u7D22\u5F15</span>
<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>

<span class="token comment"># 3. \uFF08\u53EF\u9009\uFF09\u63D0\u4EA4\u5F53\u524DGit\u7248\u672C\u5E76\u5907\u6CE8\u8BF4\u660E</span>
<span class="token function">git</span> commit -m <span class="token string">&#39;update .gitignore&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u4ECE\u6570\u7EC4\u4E2D\u968F\u673A\u9009\u53D6n\u4E2A\u5143\u7D20" tabindex="-1"><a class="header-anchor" href="#\u4ECE\u6570\u7EC4\u4E2D\u968F\u673A\u9009\u53D6n\u4E2A\u5143\u7D20" aria-hidden="true">#</a> \u4ECE\u6570\u7EC4\u4E2D\u968F\u673A\u9009\u53D6N\u4E2A\u5143\u7D20</h2><p>\u5206\u4E24\u6B65\uFF1A</p><ol><li>\u6253\u4E71\u6570\u7EC4</li><li>\u622A\u53D6\u5176\u4E2D\u7684\u524DN\u4E2A\u5143\u7D20</li></ol><p>\u6253\u4E71\u6570\u7EC4\u4F7F\u7528<strong>Fisher\u2013Yates shuffle \u6D17\u724C\u7B97\u6CD5</strong>\uFF08<code>lodash.js</code>\u4E2D\u7684<code>shuffle</code>\u51FD\u6570\u4E5F\u4F7F\u7528\u6B64\u7B97\u6CD5\u5B9E\u73B0\uFF09\u3002</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> _ <span class="token keyword">from</span> <span class="token string">&#39;lodash&#39;</span>

_<span class="token punctuation">.</span><span class="token function">shuffle</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// =&gt; [4, 1, 3, 2]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details class="custom-container details"><summary>\u81EA\u5DF1\u5B9E\u73B0</summary><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token doc-comment comment">/**
 * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle.
 *
 * <span class="token keyword">@param</span> <span class="token parameter">collection</span> The collection to shuffle.
 * <span class="token keyword">@return</span> Returns the new shuffled array.
 */</span>
<span class="token keyword">const</span> shuffle <span class="token operator">=</span> <span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>collection<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>collection<span class="token punctuation">]</span>
  <span class="token keyword">const</span> length <span class="token operator">=</span> array<span class="token punctuation">.</span>length
  <span class="token keyword">const</span> lastIndex <span class="token operator">=</span> length <span class="token operator">-</span> <span class="token number">1</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> lastIndex<span class="token punctuation">;</span> i<span class="token operator">+=</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> rand <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token punctuation">(</span>lastIndex <span class="token operator">-</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> i
    <span class="token punctuation">;</span><span class="token punctuation">[</span>array<span class="token punctuation">[</span>rand<span class="token punctuation">]</span><span class="token punctuation">,</span> array<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>array<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> array<span class="token punctuation">[</span>rand<span class="token punctuation">]</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> array
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details><p>\u622A\u53D6\u5143\u7D20\u4F7F\u7528<code>Array.slice()</code></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>
arr<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">)</span>
<span class="token comment">// Array [1,2]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15),o=[p];function c(l,i){return s(),a("div",null,o)}var d=n(t,[["render",c],["__file","note.html.vue"]]);export{d as default};
