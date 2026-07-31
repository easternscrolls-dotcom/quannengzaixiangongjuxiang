/* ============================================================
 *  分类聚合页文案库（zh / en 独立撰写，杜绝模板化重复内容）
 *  每个分类：intro（首屏导语）、body（正文段落）、faq（3 组问答）
 * ============================================================ */

const TOOL = {
  unit: {
    zh: {
      intro: '单位换算工具集合，涵盖长度、重量、温度、面积、体积、速度、压力与数据存储单位的互转。全部在浏览器本地完成计算，不联网、不上传，结果即时可见。',
      body: '跨境电商填写包裹尺寸、海外论文换算英制单位、装修估算材料用量，都会遇到单位不统一的问题。这里的每个换算器都支持双向输入，改动任意一侧另一侧同步更新，并保留足够的小数精度避免四舍五入误差。常用换算还提供常见数值对照表，方便直接查阅而不必逐个输入。',
      faq: [
        ['单位换算结果精确到几位小数？', '默认保留 6 位有效数字，长度与重量类换算内部使用国际标准换算系数（如 1 英寸 = 25.4 毫米精确值），不会出现累积误差。'],
        ['需要联网才能使用吗？', '不需要。换算逻辑全部写在页面内的 JavaScript 中，首次加载完成后断网也能继续使用。'],
        ['支持中国大陆常用的市斤、亩吗？', '支持。重量换算包含市斤、两，面积换算包含亩、公顷、平方米等中国常用单位。']
      ]
    },
    en: {
      intro: 'A complete set of free online unit converters for length, weight, temperature, area, volume, speed, pressure and digital storage. Everything is calculated locally in your browser — no upload, no sign-up, instant results.',
      body: 'Whether you are filling in parcel dimensions for cross-border shipping, converting imperial units for a research paper, or estimating materials for a renovation, mismatched units slow you down. Every converter here works in both directions: edit either side and the other updates instantly, with enough decimal precision to avoid rounding drift. Common conversions also include quick reference tables so you can read off a value without typing.',
      faq: [
        ['How accurate are the conversion results?', 'Results keep 6 significant digits and use exact international factors (for example 1 inch = 25.4 mm), so there is no accumulated rounding error.'],
        ['Do I need an internet connection?', 'No. All conversion logic lives in the page JavaScript, so once loaded the tools keep working offline.'],
        ['Can I convert between metric and imperial in one step?', 'Yes. Metric and imperial units sit in the same dropdown, so a single conversion covers both systems.']
      ]
    }
  },
  text: {
    zh: {
      intro: '文本处理工具集合：字数统计、大小写转换、去重排序、文本对比、批量替换、编码清洗与格式整理，适合写作、运营与数据整理场景。',
      body: '处理文本最花时间的往往不是写，而是整理。这里的工具覆盖从粗加工到精修的完整链路：先用去重和空行清理压缩杂乱内容，再用批量替换统一术语，最后用文本对比核查两版差异。所有操作都在本地内存中进行，粘贴再长的文本也不会被上传到服务器。',
      faq: [
        ['文本会被上传保存吗？', '不会。所有处理都在浏览器内存里完成，关闭页面即清空，服务器不会收到任何文本内容。'],
        ['能处理多大的文本？', '常规几十万字符没有问题，具体上限取决于设备内存。超大文件建议分批粘贴。'],
        ['文本对比支持逐字高亮吗？', '支持。对比工具会按行定位差异并在行内高亮具体变化的字符片段。']
      ]
    },
    en: {
      intro: 'Free online text tools: word counter, case converter, duplicate remover, diff checker, bulk find-and-replace, whitespace cleaner and line sorter. All processing happens in your browser.',
      body: 'The slow part of working with text is rarely the writing — it is the cleanup. These tools cover the full chain: strip duplicates and blank lines to compress messy input, run a bulk replace to unify terminology, then use the diff checker to verify what actually changed between two versions. Nothing is uploaded; the text stays in your browser memory and disappears when you close the tab.',
      faq: [
        ['Is my text uploaded to a server?', 'No. Every operation runs in browser memory and is cleared when the tab closes. No text ever reaches a server.'],
        ['How large a document can I paste?', 'Several hundred thousand characters work fine on a typical machine; the real limit is your device memory.'],
        ['Does the diff checker highlight character-level changes?', 'Yes. It locates differences line by line and highlights the exact characters that changed within each line.']
      ]
    }
  },
  img: {
    zh: {
      intro: '图片处理工具集合：压缩、裁剪、缩放、格式转换、加水印、去背景、批量重命名与尺寸查询，全部在浏览器本地运行，图片不会离开你的设备。',
      body: '在线图片工具最大的顾虑是隐私——上传到别人服务器的照片去了哪里无从知晓。这里所有图片工具都基于 Canvas 与 WebAssembly 在本地完成，选择文件后浏览器直接读取处理，不产生任何网络上传。压缩支持质量滑杆实时预览体积变化，格式转换覆盖 JPG / PNG / WebP / AVIF 互转，批量处理可一次拖入多张并打包下载。',
      faq: [
        ['图片会上传到服务器吗？', '不会。工具通过浏览器 Canvas API 在本地读取和处理图片，全程无网络传输，断网也能用。'],
        ['压缩后画质损失大吗？', '可自行调节质量参数并实时预览。一般 JPG 压到 75% 质量时体积可降 60% 以上，肉眼几乎无差别。'],
        ['支持一次处理多张图片吗？', '支持。压缩、格式转换、加水印等工具都提供批量模式，处理完可打包为 ZIP 一次下载。']
      ]
    },
    en: {
      intro: 'Free image tools that run 100% client side: compress, crop, resize, convert format, add watermark, remove background and batch rename. Your images never leave your device.',
      body: 'The usual worry with online image tools is privacy — once a photo is uploaded you have no idea where it lives. Everything here runs locally through the Canvas API and WebAssembly, so the browser reads and processes the file directly with zero network transfer. Compression gives you a quality slider with a live file-size preview, format conversion covers JPG / PNG / WebP / AVIF in every direction, and batch mode lets you drop in many files at once and download the results as a ZIP.',
      faq: [
        ['Are my images uploaded anywhere?', 'No. Images are read and processed locally via the browser Canvas API. There is no network transfer at any point, and the tools work offline.'],
        ['How much quality is lost when compressing?', 'You control the quality setting with a live preview. A JPG at 75% quality typically drops over 60% in size with no visible difference.'],
        ['Can I process multiple images at once?', 'Yes. Compression, format conversion and watermarking all support batch mode with a single ZIP download at the end.']
      ]
    }
  },
  dev: {
    zh: {
      intro: '开发调试工具集合：编码解码、加密哈希、正则测试、时间戳转换、UUID 生成、颜色取值、代码美化与压缩，覆盖日常开发高频场景。',
      body: '开发过程中总有一堆零碎需求：临时解一段 Base64、算个 MD5、把 Unix 时间戳还原成可读日期、验证正则是否匹配。为这些事装一个客户端并不划算，但每次翻墙找在线站点又要担心把密钥、Token 粘贴到陌生服务器上。这里的工具全部在本地执行，敏感数据不出浏览器，可放心处理内部配置与凭据。',
      faq: [
        ['粘贴的密钥和 Token 安全吗？', '安全。加密、哈希、编解码全部由浏览器本地 JavaScript 与 Web Crypto API 完成，不会发送到任何服务器。'],
        ['正则测试支持哪些标志位？', '支持 g、i、m、s、u、y 全部 JavaScript 标志位，并实时高亮匹配片段与捕获组。'],
        ['时间戳转换支持毫秒吗？', '支持。可自动识别 10 位秒级与 13 位毫秒级时间戳，并按本地时区与 UTC 双栏显示。']
      ]
    },
    en: {
      intro: 'Free online developer tools: encoders and decoders, hash generators, regex tester, timestamp converter, UUID generator, color picker, code beautifier and minifier.',
      body: 'Development throws up a steady stream of small tasks: decode a Base64 blob, compute an MD5, turn a Unix timestamp back into a readable date, check whether a regex actually matches. Installing a desktop app for that is overkill, but pasting keys and tokens into an unknown server is a real risk. Every tool here executes locally with plain JavaScript and the Web Crypto API, so sensitive data never leaves the browser and you can safely work with internal configs and credentials.',
      faq: [
        ['Is it safe to paste API keys and tokens?', 'Yes. Hashing, encryption and encoding all run locally through browser JavaScript and the Web Crypto API. Nothing is transmitted.'],
        ['Which regex flags does the tester support?', 'All JavaScript flags — g, i, m, s, u and y — with live highlighting of matches and capture groups.'],
        ['Does the timestamp converter handle milliseconds?', 'Yes. It auto-detects 10-digit second and 13-digit millisecond timestamps and shows both local time and UTC.']
      ]
    }
  },
  pdf: {
    zh: {
      intro: 'PDF 工具集合：合并、拆分、压缩、加密解密、页面旋转、提取图片与文字、PDF 转图片，浏览器本地处理，文档不上传。',
      body: 'PDF 常常装着合同、简历、财报这类不便外传的内容，而大多数在线 PDF 站点都要求先上传文件。这里的处理基于 PDF.js 与 pdf-lib 在本地完成：选择文件后浏览器直接读取字节流，合并与拆分只重排页面对象、不重新渲染，因此不会损失原有清晰度与可复制的文字层。',
      faq: [
        ['PDF 文件会上传吗？', '不会。文件通过浏览器 File API 本地读取，所有页面操作在内存中完成，服务器全程不接触文件内容。'],
        ['合并后文字还能选中复制吗？', '可以。合并采用页面对象重组而非重新渲染成图片，原有文字层、书签与超链接都会保留。'],
        ['能处理加密的 PDF 吗？', '能。若已知打开密码，可在解密工具中输入密码后解除限制，再进行后续编辑。']
      ]
    },
    en: {
      intro: 'Free online PDF tools: merge, split, compress, encrypt and decrypt, rotate pages, extract images and text, and convert PDF to images — all processed inside your browser.',
      body: 'PDFs usually carry the documents you least want to hand over: contracts, resumes, financial statements. Most online PDF sites require an upload first. Here everything runs locally on PDF.js and pdf-lib — the browser reads the byte stream directly, and merging or splitting rearranges page objects instead of re-rendering, so the original resolution, selectable text layer, bookmarks and hyperlinks all survive intact.',
      faq: [
        ['Do my PDF files get uploaded?', 'No. Files are read locally through the browser File API and all page operations happen in memory. The server never sees the content.'],
        ['Is text still selectable after merging?', 'Yes. Merging recombines page objects rather than flattening to images, so the text layer, bookmarks and links are preserved.'],
        ['Can I work with password-protected PDFs?', 'Yes. If you know the open password, enter it in the decrypt tool to lift the restriction before editing.']
      ]
    }
  },
  video: {
    zh: {
      intro: '视频处理工具集合：格式转换、压缩、剪辑、提取音频、转 GIF、加水印、调整分辨率与倍速播放，基于 WebAssembly 本地转码。',
      body: '视频文件动辄几百 MB，上传到在线转换站既慢又有隐私风险。这里的视频工具通过 WebAssembly 版 FFmpeg 在浏览器内直接转码，文件不出本机，处理速度取决于你自己的 CPU 而非服务器排队。适合快速裁剪一段素材、把手机拍的 MOV 转成通用 MP4，或从视频里单独抽出音轨。',
      faq: [
        ['本地转码会很慢吗？', '取决于设备性能与视频长度。短视频（1 分钟内）通常几十秒完成；长视频建议先裁剪再转码。'],
        ['支持哪些输入格式？', '常见的 MP4、MOV、AVI、MKV、WebM、FLV 均可读取，输出以 MP4 与 WebM 为主，兼容性最好。'],
        ['转换过程中可以关闭页面吗？', '不可以。转码在当前页面进行，关闭标签页会中断任务，建议处理完成后再离开。']
      ]
    },
    en: {
      intro: 'Free online video tools: convert format, compress, trim, extract audio, create GIFs, add watermarks and change resolution — powered by WebAssembly, encoded on your own machine.',
      body: 'Video files run to hundreds of megabytes, which makes uploading to a conversion site both slow and risky. These tools transcode directly in the browser using a WebAssembly build of FFmpeg, so the file never leaves your computer and speed depends on your own CPU rather than a server queue. It is ideal for quickly trimming a clip, turning a phone-recorded MOV into a universally playable MP4, or pulling the audio track out of a video.',
      faq: [
        ['Is local transcoding slow?', 'It depends on your hardware and clip length. Clips under a minute usually finish in well under a minute; trim long videos before converting.'],
        ['Which input formats are supported?', 'MP4, MOV, AVI, MKV, WebM and FLV can all be read. Output focuses on MP4 and WebM for the widest compatibility.'],
        ['Can I close the tab while converting?', 'No. Transcoding runs in the open page, so closing the tab cancels the job. Wait for it to finish before navigating away.']
      ]
    }
  },
  audio: {
    zh: {
      intro: '音频处理工具集合：格式转换、剪辑裁切、合并拼接、降噪、变速变调、音量标准化、提取人声与元数据编辑，全部浏览器本地完成。',
      body: '做播客、剪配音或整理音乐库时，往往只需要一两个简单操作——去掉开头的空白、把音量调匀、转成 MP3。为此打开专业音频软件太重。这里的工具用 Web Audio API 直接解码波形，剪辑和音量处理是样本级操作，导出时才重新编码，因此中间步骤不会反复损失音质。',
      faq: [
        ['音频质量会因为多次处理而变差吗？', '不会明显变差。所有编辑在解码后的 PCM 波形上进行，只在最终导出时编码一次。'],
        ['支持无损格式吗？', '支持读取与导出 WAV、FLAC 等无损格式，也可转换为 MP3、AAC、OGG 等有损格式。'],
        ['降噪效果如何？', '适合处理稳态底噪（如空调声、电流声）。突发性噪音（如敲击声）建议用剪辑工具直接裁掉。']
      ]
    },
    en: {
      intro: 'Free online audio tools: convert format, trim and cut, merge, remove noise, change speed and pitch, normalise volume, isolate vocals and edit metadata — all in your browser.',
      body: 'Podcasting, voice-over editing and tidying a music library usually need only one or two small operations: strip the silence at the front, even out the volume, export as MP3. Opening a full DAW for that is overkill. These tools decode the waveform with the Web Audio API and edit at sample level, encoding only once at export, so intermediate steps never stack up generation loss.',
      faq: [
        ['Does repeated editing degrade the audio?', 'Not noticeably. Edits are applied to the decoded PCM waveform and encoding happens only once, at export.'],
        ['Are lossless formats supported?', 'Yes. WAV and FLAC can be read and exported, alongside lossy formats such as MP3, AAC and OGG.'],
        ['How good is the noise removal?', 'It works well on steady background noise such as air conditioning or electrical hum. For sudden noises, trimming the region out is more effective.']
      ]
    }
  },
  csv: {
    zh: {
      intro: '表格与 CSV 工具集合：CSV 转 JSON、格式互转、去重、列筛选、行列转置、合并拆分与数据清洗，适合运营与数据整理日常处理。',
      body: '从后台导出的 CSV 往往带着乱码、多余空列或重复行，用 Excel 打开还可能把长数字变成科学计数法、把订单号前面的零吃掉。这里的工具直接按文本解析，保留原始字符串不做类型猜测，因此手机号、身份证号、订单号都不会被改写。处理完可导出为 CSV、JSON、Markdown 表格或 SQL 插入语句。',
      faq: [
        ['为什么 Excel 会把订单号开头的 0 去掉？', '因为 Excel 自动按数字类型解析。这里的工具全部按文本处理，不会改写任何原始字符。'],
        ['支持多大的 CSV 文件？', '数万行通常流畅。超过十万行时建议先按列筛选减少数据量，具体上限取决于设备内存。'],
        ['能处理中文乱码吗？', '能。工具支持 UTF-8 与 GBK 编码识别，可手动切换编码后重新解析。']
      ]
    },
    en: {
      intro: 'Free CSV and spreadsheet tools: CSV to JSON converter, format conversion, deduplication, column filtering, transpose, merge, split and data cleaning.',
      body: 'CSV exports arrive with broken encoding, stray empty columns and duplicate rows — and opening them in Excel can silently turn long numbers into scientific notation or strip the leading zeros off an order ID. These tools parse everything as text without guessing types, so phone numbers, ID numbers and order references stay exactly as they were. Results export to CSV, JSON, a Markdown table or SQL insert statements.',
      faq: [
        ['Why does Excel drop the leading zero from my IDs?', 'Excel auto-detects a numeric type. These tools treat every field as text, so no original character is ever rewritten.'],
        ['How large a CSV can I process?', 'Tens of thousands of rows run smoothly. Beyond a hundred thousand, filter columns first to cut the data volume.'],
        ['Can it fix garbled non-English characters?', 'Yes. Both UTF-8 and legacy encodings are detected, and you can switch encoding manually and re-parse.']
      ]
    }
  },
  business: {
    zh: {
      intro: '商务计算工具集合：贷款还款、利率换算、利润率与毛利、投资回报 ROI、广告出价、批量调价、汇率与税费估算。',
      body: '做生意的数字大多不复杂，麻烦在于每次都要重新列公式，而且容易漏掉税费或手续费。这里的计算器把常见业务场景固化成表单：填入成本、售价与平台佣金就能反推真实利润；输入贷款金额与利率能一次看到等额本息与等额本金的完整还款计划对比。',
      faq: [
        ['贷款计算支持提前还款吗？', '支持。可设置提前还款的时间与金额，计算器会重新推算剩余期数与节省的总利息。'],
        ['利润率计算包含平台佣金吗？', '包含。可分别填写平台佣金比例、支付手续费与物流成本，得到扣除后的净利润与真实毛利率。'],
        ['汇率是实时的吗？', '汇率需手动填写当前值。工具不联网抓取汇率，以保证离线可用与结果可复现。']
      ]
    },
    en: {
      intro: 'Free business calculators: loan repayment, interest rate conversion, profit margin, ROI, advertising bid, bulk repricing, currency and tax estimation.',
      body: 'Business maths is rarely complicated — the friction is rebuilding the same formula every time and forgetting a fee along the way. These calculators turn common scenarios into simple forms: enter cost, selling price and platform commission to work back to true profit, or enter a loan amount and rate to see equal-instalment and equal-principal repayment schedules side by side.',
      faq: [
        ['Does the loan calculator handle early repayment?', 'Yes. Set the date and amount of an early repayment and it recalculates the remaining term and the total interest saved.'],
        ['Does the margin calculator include platform fees?', 'Yes. Commission rate, payment processing fee and shipping cost can each be entered to get net profit and true gross margin.'],
        ['Are exchange rates live?', 'Rates are entered manually. The tools do not fetch live data, which keeps them usable offline and makes results reproducible.']
      ]
    }
  },
  url: {
    zh: {
      intro: 'URL 工具集合：URL 编码解码、查询参数解析与拼接、短链还原、批量链接状态检测、UTM 参数生成与链接清洗。',
      body: '带追踪参数的链接又长又乱，分享出去不专业，直接删又怕破坏跳转。这里的解析工具会把 URL 拆成协议、域名、路径、查询参数与锚点逐项展示，可勾选保留需要的参数再重新拼装。批量状态检测则可一次粘贴多条链接，查看各自的 HTTP 状态码与最终跳转目标。',
      faq: [
        ['为什么中文链接复制出来变成一串百分号？', '那是 URL 百分号编码。用解码工具粘贴进去即可还原成可读的中文原文。'],
        ['批量检测能查多少条链接？', '建议单次 200 条以内。检测受浏览器跨域策略限制，部分站点可能无法返回真实状态码。'],
        ['UTM 参数生成器支持自定义字段吗？', '支持。除五个标准 UTM 字段外可添加任意自定义参数，生成后可直接复制或转为短链。']
      ]
    },
    en: {
      intro: 'Free URL tools: encoder and decoder, query string parser and builder, redirect resolver, bulk link status checker, UTM campaign builder and link cleaner.',
      body: 'Tracking-laden URLs are long and ugly to share, but deleting parameters by hand risks breaking the redirect. The parser breaks a URL into protocol, host, path, query parameters and fragment so you can tick the ones worth keeping and rebuild a clean link. The bulk checker takes a list of URLs and reports each HTTP status code and final redirect destination in one pass.',
      faq: [
        ['Why do non-English URLs turn into percent signs?', 'That is percent-encoding. Paste the string into the decoder to restore the original readable text.'],
        ['How many links can the bulk checker handle?', 'Around 200 per run is comfortable. Browser cross-origin rules mean some sites will not return a real status code.'],
        ['Can the UTM builder add custom parameters?', 'Yes. Beyond the five standard UTM fields you can append any custom key-value pairs and copy or shorten the result.']
      ]
    }
  },
  json: {
    zh: {
      intro: 'JSON 工具集合：格式化美化、压缩、语法校验、JSON 转 CSV / YAML / XML、路径查询、差异对比与转义处理。',
      body: '接口返回的 JSON 挤成一行时几乎无法阅读，而线上格式化工具又可能把包含用户数据的响应体记录下来。这里的解析器在本地运行，格式化时会标出具体出错的行列位置而不只是提示"无效 JSON"，大文件采用折叠树展示，可逐层展开定位到目标字段。',
      faq: [
        ['校验失败时能定位到具体位置吗？', '可以。校验器会给出出错的行号与列号，并高亮该处字符，常见的多余逗号、缺引号都能直接看到。'],
        ['支持 JSON5 或带注释的 JSON 吗？', '支持宽松模式解析，可读取带注释与尾随逗号的内容，导出时会自动转为标准 JSON。'],
        ['数据会被记录吗？', '不会。解析完全在浏览器内完成，不发送任何请求，可放心粘贴含敏感字段的接口响应。']
      ]
    },
    en: {
      intro: 'Free online JSON tools: formatter and beautifier, minifier, validator, JSON to CSV / YAML / XML converter, path query, diff and escape utilities.',
      body: 'A minified API response is nearly unreadable, and pasting one into an unknown formatter may hand over live user data. This parser runs locally and, when validation fails, points to the exact line and column rather than just reporting "invalid JSON". Large payloads render as a collapsible tree so you can drill down to the field you actually need.',
      faq: [
        ['Does the validator show where the error is?', 'Yes. It reports the line and column and highlights the offending character, which makes stray commas and missing quotes obvious.'],
        ['Can it read JSON5 or JSON with comments?', 'Yes. A lenient parsing mode accepts comments and trailing commas, and exports clean standard JSON.'],
        ['Is my data logged?', 'No. Parsing is entirely in-browser with no network requests, so responses containing sensitive fields are safe to paste.']
      ]
    }
  },
  seo: {
    zh: {
      intro: 'SEO 工具集合：Meta 标签生成、robots.txt 与 sitemap 生成、标题长度检测、关键词密度分析、结构化数据与 ALT 标签批量生成。',
      body: 'SEO 的基础工作大多是重复劳动：给每个页面写标题与描述、控制字符数、生成 sitemap。这里的工具把这些环节标准化——标题检测会按搜索结果的像素宽度而非单纯字数判断是否会被截断，Meta 生成器同时输出 Open Graph 与 Twitter Card 标签，sitemap 生成器支持批量粘贴 URL 并设置更新频率与权重。',
      faq: [
        ['标题多少字符不会被截断？', '搜索结果按像素宽度截断而非字符数。中文约 30 字、英文约 60 字符较稳妥，检测工具会实时模拟显示效果。'],
        ['生成的结构化数据能直接用吗？', '可以。输出为标准 JSON-LD 格式，粘贴进页面 head 即可，建议再用官方富媒体测试工具验证一次。'],
        ['关键词密度多少合适？', '一般建议 1%–3%。过高会被判定堆砌，工具会同时列出词频与占比供参考。']
      ]
    },
    en: {
      intro: 'Free SEO tools: meta tag generator, robots.txt and sitemap builder, title length checker, keyword density analyser, structured data and bulk ALT text generator.',
      body: 'Most foundational SEO work is repetition: writing a title and description for every page, keeping them within length, regenerating a sitemap. These tools standardise those steps — the title checker measures pixel width the way search results actually truncate rather than counting characters, the meta generator emits Open Graph and Twitter Card tags together, and the sitemap builder accepts a pasted URL list with change frequency and priority.',
      faq: [
        ['How long can a title be before truncation?', 'Search results truncate by pixel width, not character count. Around 60 characters is safe for English, and the checker simulates the rendered result live.'],
        ['Is the generated structured data ready to use?', 'Yes. It outputs standard JSON-LD to paste into the page head; validating once with the official rich results test is still recommended.'],
        ['What keyword density should I aim for?', 'Roughly 1%–3%. Higher risks being flagged as stuffing, and the tool lists both raw frequency and percentage.']
      ]
    }
  },
  gif: {
    zh: {
      intro: 'GIF 工具集合：视频转 GIF、GIF 压缩优化、GIF 拆帧、多图合成 GIF 与播放速度调整。',
      body: 'GIF 常用来做教程演示和表情图，问题是体积容易失控——一段十几秒的录屏动辄十几 MB。这里的转换器提供帧率、尺寸与调色板三个关键参数：把帧率降到 10–12 fps、宽度限制在 640 像素以内，通常能在观感基本不变的前提下把体积压到原来的三分之一。',
      faq: [
        ['GIF 体积太大怎么优化？', '优先降帧率（10–12 fps 足够流畅）和缩小尺寸，其次减少调色板颜色数，三者结合通常可压缩 60% 以上。'],
        ['视频转 GIF 有时长限制吗？', '技术上无硬性限制，但超过 30 秒的 GIF 体积会非常大，建议先裁剪出关键片段。'],
        ['能保留透明背景吗？', '可以。从 PNG 序列合成 GIF 时支持单色透明通道，视频转 GIF 因源视频通常无透明层则不支持。']
      ]
    },
    en: {
      intro: 'Free GIF tools: video to GIF converter, GIF compressor and optimiser, frame extractor, image sequence to GIF builder and playback speed adjuster.',
      body: 'GIFs are the default for tutorial clips and reaction images, but file size gets out of hand fast — a fifteen-second screen recording easily hits double-digit megabytes. The converter exposes the three parameters that matter: frame rate, dimensions and palette size. Dropping to 10–12 fps and capping width at 640 pixels typically cuts the file to a third with little visible difference.',
      faq: [
        ['How do I shrink an oversized GIF?', 'Lower the frame rate first (10–12 fps still looks smooth), then reduce dimensions, then cut palette colours. Together they usually save over 60%.'],
        ['Is there a length limit for video to GIF?', 'No hard limit, but anything past 30 seconds produces a very large file. Trim to the key segment first.'],
        ['Can transparency be preserved?', 'Yes when building a GIF from PNG frames, which supports a single transparent colour. Video sources have no alpha channel, so that path does not.']
      ]
    }
  }
};

const THEME = {
  blog: {
    zh: {
      intro: '响应式博客主题模板，纯 HTML + CSS + JavaScript 编写，不依赖任何框架与构建工具，下载解压后直接双击打开即可预览。',
      body: '这些博客模板面向个人写作者与技术博主：内置文章列表、分类归档、标签筛选、全文搜索与明暗双模式，排版针对长文阅读优化，正文行高与字号在移动端会自动调整。因为没有框架依赖，你可以直接托管到 GitHub Pages、Vercel 或 Netlify，也可以丢进任意虚拟主机的 public 目录。',
      faq: [
        ['需要懂编程才能改吗？', '不需要。文章内容与站点标题都集中在少量 HTML 文件里，用记事本替换文字即可，样式颜色在 CSS 顶部的变量区统一修改。'],
        ['可以用于商业项目吗？', '可以。模板采用 MIT 或 Apache-2.0 许可，允许商用、修改与二次分发，保留许可证声明即可。'],
        ['托管需要服务器和数据库吗？', '都不需要。全部是静态文件，托管在 GitHub Pages、Vercel、Netlify 或 Cloudflare Pages 上即可，通常完全免费。']
      ]
    },
    en: {
      intro: 'Free responsive blog HTML templates written in plain HTML, CSS and JavaScript. No framework, no build step — unzip and open the file to preview.',
      body: 'These blog templates target individual writers and technical bloggers: post listings, category archives, tag filtering, full-text search and a light/dark toggle are all built in, with typography tuned for long-form reading and line height adjusted automatically on mobile. Because there is no framework dependency, you can host them on GitHub Pages, Vercel or Netlify, or drop them into the public directory of any shared host.',
      faq: [
        ['Do I need to know how to code?', 'No. Post content and site titles live in a handful of HTML files you can edit in any text editor, and colours are set from a variable block at the top of the CSS.'],
        ['Can I use these commercially?', 'Yes. The templates are MIT or Apache-2.0 licensed, which permits commercial use, modification and redistribution as long as the licence notice is kept.'],
        ['Do I need a server or database?', 'Neither. These are static files — GitHub Pages, Vercel, Netlify or Cloudflare Pages will host them, usually for free.']
      ]
    }
  },
  homepage: {
    zh: {
      intro: '个人主页与作品集模板，含技能展示、项目卡片、履历时间线与联系方式模块，适合求职、接单与个人品牌展示。',
      body: '作品集页面的核心是让人在十几秒内看懂你能做什么。这些模板把首屏留给一句话定位与核心技能标签，往下依次是项目卡片、经历时间线与联系入口，结构固定但配色与字体可通过 CSS 变量整体替换。所有模板都做过移动端适配，HR 用手机打开也不会错版。',
      faq: [
        ['项目卡片能放多少个？', '不限。卡片区是网格布局，复制一段卡片 HTML 就能增加一个，数量变化时排版会自动重排。'],
        ['能绑定自己的域名吗？', '可以。托管到 Vercel 或 Netlify 后，在控制台添加自定义域名并按提示配置 DNS 即可，证书自动签发。'],
        ['支持深色模式吗？', '支持。模板内置明暗两套配色，会跟随系统设置自动切换，也可手动点击切换按钮。']
      ]
    },
    en: {
      intro: 'Free personal portfolio website templates in HTML and CSS, with skill sections, project cards, an experience timeline and a contact block — ideal for job hunting and freelancing.',
      body: 'A portfolio has to say what you do within about fifteen seconds. These templates give the first screen to a one-line positioning statement and your core skill tags, followed by project cards, an experience timeline and a contact section. The structure is fixed but colours and fonts can be swapped wholesale through CSS variables. Every template is mobile-tested, so a recruiter opening it on a phone still sees a clean layout.',
      faq: [
        ['How many project cards can I add?', 'As many as you like. The card area is a CSS grid — duplicate one card block of HTML to add another and the layout reflows automatically.'],
        ['Can I use my own domain?', 'Yes. Host on Vercel or Netlify, add a custom domain in the dashboard and follow the DNS instructions; the TLS certificate is issued automatically.'],
        ['Is dark mode included?', 'Yes. Each template ships with light and dark palettes that follow the system setting, plus a manual toggle.']
      ]
    }
  },
  toolpage: {
    zh: {
      intro: '工具站与导航站模板，卡片式聚合首页，内置搜索框、分类筛选、收藏标记与最近使用记录，适合搭建自己的在线工具集合。',
      body: '如果你想把散落的小工具或常用网址整理成一个站点，这类模板可以省掉从零搭框架的时间。首页采用卡片网格，工具条目集中定义在一个 JavaScript 数组里，添加新条目只需追加一行数据而不必改动 HTML 结构。搜索为前端实时过滤，分类标签支持多级切换，收藏状态存在浏览器本地。',
      faq: [
        ['怎么添加新的工具条目？', '打开数据文件，在数组里追加一个包含名称、链接、分类的对象即可，首页会自动渲染出对应卡片。'],
        ['支持多少个工具条目？', '几百条完全没问题。数据在前端一次性加载并过滤，条目过千时建议改为分页或按分类拆分数据文件。'],
        ['收藏功能会同步到其他设备吗？', '不会。收藏状态保存在浏览器 localStorage 中，仅在当前设备当前浏览器有效。']
      ]
    },
    en: {
      intro: 'Free toolbox and bookmark navigation website templates with a card-grid homepage, built-in search, category filters, favourites and recently-used history.',
      body: 'If you want to gather scattered utilities or frequently used links into one site, these templates save you from building the scaffolding yourself. The homepage is a card grid and the entries live in a single JavaScript array, so adding one means appending a line of data rather than touching the HTML. Search filters client side in real time, category tags support nested switching, and favourites persist in browser storage.',
      faq: [
        ['How do I add a new entry?', 'Open the data file and append an object with name, link and category. The homepage renders the matching card automatically.'],
        ['How many entries can it hold?', 'Several hundred is comfortable. Everything loads and filters client side, so past a thousand entries consider pagination or splitting the data by category.'],
        ['Do favourites sync across devices?', 'No. Favourites are stored in browser localStorage and stay on the current device and browser.']
      ]
    }
  },
  dark: {
    zh: {
      intro: '暗黑风格网站模板，低饱和深色配色，长时间浏览不刺眼，适合资源站、工具站与技术类内容站点。',
      body: '暗色设计的难点不在于把背景改黑，而在于对比度控制——纯黑底配纯白字会产生光晕，长时间阅读反而更累。这些模板采用深灰蓝底色搭配柔和文字色，正文对比度控制在 WCAG AA 标准之上，强调色仅用于按钮与链接等交互元素，视觉重心不会被抢走。',
      faq: [
        ['暗色模板会影响 SEO 吗？', '不会。搜索引擎不评判配色，只要文字是真实 HTML 文本而非图片，收录与排名不受影响。'],
        ['可以切换成浅色吗？', '可以。模板保留了浅色变量组，在 CSS 顶部切换默认主题或加上跟随系统的媒体查询即可。'],
        ['配色符合无障碍标准吗？', '正文与背景的对比度达到 WCAG AA 级要求，辅助文字也保持在可读区间。']
      ]
    },
    en: {
      intro: 'Free dark mode responsive website templates with a low-saturation palette that stays comfortable during long sessions — well suited to resource sites, tool sites and technical content.',
      body: 'The hard part of dark design is not making the background black; it is contrast. Pure white text on pure black creates halation and tires the eyes faster than a light theme. These templates use a deep grey-blue base with softened text colours, keep body contrast above the WCAG AA threshold, and reserve the accent colour for interactive elements such as buttons and links so the visual hierarchy stays intact.',
      faq: [
        ['Does a dark theme hurt SEO?', 'No. Search engines do not judge colour schemes. As long as the text is real HTML rather than images, indexing and ranking are unaffected.'],
        ['Can I switch it to light?', 'Yes. A light variable set is included — change the default theme at the top of the CSS or add a media query to follow the system setting.'],
        ['Is the palette accessible?', 'Body text meets WCAG AA contrast against the background, and secondary text stays within a readable range.']
      ]
    }
  },
  light: {
    zh: {
      intro: '清新浅色网站模板，大留白与强排版设计，适合内容型站点、文档站与品牌展示页。',
      body: '浅色模板的价值在于让内容本身成为主角。这些模板用较大的段落间距与克制的分隔线建立层次，不依赖阴影和边框堆砌视觉，标题层级通过字号与字重区分。整体加载资源很轻，首屏通常在一秒内完成渲染，对搜索引擎的页面体验指标较为友好。',
      faq: [
        ['适合做企业官网吗？', '适合。浅色大留白风格在企业官网、产品介绍页与文档站上都很常见，专业感强且易于阅读。'],
        ['字体可以换成中文字体吗？', '可以。在 CSS 的 font-family 变量里替换即可，模板已预留中文字体回退链，不会出现方框乱码。'],
        ['加载速度怎么样？', '模板不引入外部框架与图标库，仅有少量内联样式与脚本，首屏渲染通常在一秒以内。']
      ]
    },
    en: {
      intro: 'Free clean minimal light website templates built on generous whitespace and strong typography — a good fit for content sites, documentation and brand pages.',
      body: 'A light template earns its keep by letting the content lead. These build hierarchy through paragraph spacing and restrained dividers rather than stacking shadows and borders, and separate heading levels by size and weight alone. The asset footprint is small, so the first screen typically renders in under a second, which helps page experience metrics.',
      faq: [
        ['Are these suitable for a company site?', 'Yes. Light, spacious layouts are standard for corporate sites, product pages and documentation because they read as professional and are easy to scan.'],
        ['Can I change the font?', 'Yes. Swap the value in the CSS font-family variable; a fallback chain is already defined so nothing renders as missing glyph boxes.'],
        ['How fast do they load?', 'No external framework or icon library is pulled in — just a small amount of inline CSS and script — so the first screen usually renders within a second.']
      ]
    }
  }
};

const SOURCE = {
  blogsrc: {
    zh: {
      intro: '博客系统源码，无需数据库，文章以静态文件形式存储，自带分类、标签、搜索与归档功能，开箱即可部署。',
      body: '传统博客程序要装数据库、配 PHP 环境、还要定期升级补漏洞。这套源码把文章存成静态文件，站点本身只有 HTML、CSS 与少量 JavaScript，没有后端也就没有被注入和爆破的入口。部署后无需运维，托管在静态平台上几乎零成本，备份只需要复制整个目录。',
      faq: [
        ['没有数据库怎么管理文章？', '文章以独立文件存放，新增一篇就是加一个文件并在索引里登记一行，也可以用附带的生成脚本自动更新索引。'],
        ['搜索功能是怎么实现的？', '构建时生成一份轻量索引文件，前端加载后在浏览器内匹配，无需后端接口，几百篇文章依然秒出结果。'],
        ['安全性如何？', '没有后端与数据库，也就不存在 SQL 注入、后台弱口令等常见风险，静态托管平台还会自动提供 HTTPS。']
      ]
    },
    en: {
      intro: 'No-database static blog HTML source code. Posts are stored as flat files, with categories, tags, search and archives built in — deploy as-is.',
      body: 'Traditional blog engines mean installing a database, configuring a runtime and patching it forever. This source keeps posts as static files, so the site is just HTML, CSS and a little JavaScript — with no backend there is no injection surface and no login to brute force. Once deployed it needs no maintenance, static hosting costs essentially nothing, and a backup is simply a copy of the directory.',
      faq: [
        ['How do I manage posts without a database?', 'Each post is its own file. Adding one means creating the file and registering a line in the index, or running the included script to regenerate the index.'],
        ['How does search work?', 'A lightweight index is generated at build time and matched in the browser, so no backend API is needed and hundreds of posts still return instantly.'],
        ['Is it secure?', 'With no backend or database there is no SQL injection or weak admin password to exploit, and static hosts provide HTTPS automatically.']
      ]
    }
  },
  navsrc: {
    zh: {
      intro: '网址导航站源码，支持分组管理、自定义分类、快速搜索与明暗模式，适合搭建团队内部导航或个人书签站。',
      body: '浏览器书签栏一旦超过几十条就很难找了，做成导航站可以按业务分组并支持搜索。这套源码把所有网址集中在一个配置文件中，改动后刷新即生效；卡片可显示网站图标与一句话描述，支持按分组折叠。部署到内网静态服务器就是一个团队公用的入口页。',
      faq: [
        ['网站图标怎么获取？', '默认使用各站点的 favicon 地址自动加载，也可在配置里手动指定本地图标文件以避免外链失效。'],
        ['能做成团队内部使用吗？', '可以。部署到内网静态服务器或加一层基础认证即可，源码本身不含任何外部依赖与统计代码。'],
        ['支持多少个分组？', '不限。分组由配置数组决定，数量增加时侧边栏会自动滚动，建议单组控制在 20 条以内便于查找。']
      ]
    },
    en: {
      intro: 'Bookmark navigation website source code with grouped categories, custom sections, instant search and dark mode — good for team start pages and personal bookmark hubs.',
      body: 'A browser bookmark bar stops being useful past a few dozen entries. Turning it into a navigation site lets you group links by purpose and search across them. This source keeps every URL in one config file that takes effect on refresh; cards can show a site icon and a one-line description, and groups collapse independently. Deployed to an internal static server it becomes a shared team start page.',
      faq: [
        ['Where do the site icons come from?', 'By default each site favicon is loaded from its own URL. You can also point entries at local icon files so nothing breaks if the remote link dies.'],
        ['Can it be used internally by a team?', 'Yes. Deploy to an internal static server or put basic auth in front of it. The source has no external dependencies or tracking code.'],
        ['How many groups are supported?', 'No limit — groups come from a config array and the sidebar scrolls as it grows. Around 20 links per group keeps scanning easy.']
      ]
    }
  },
  toolsrc: {
    zh: {
      intro: '在线工具箱全站源码，卡片式工具聚合首页，含搜索、分类筛选、收藏与最近使用，可直接改造成自己的工具站。',
      body: '这套源码是一个完整可运行的工具站骨架：首页负责聚合与检索，每个工具是一个独立 HTML 页面，彼此之间没有耦合，删掉任意一个都不影响其他页面。想加自己的工具，只需按同样结构写一个 HTML 文件并在数据表里登记，首页自动出现对应卡片。所有工具页共用同一套样式变量，改一处颜色全站生效。',
      faq: [
        ['可以只保留部分工具吗？', '可以。每个工具都是独立页面，删除文件并从数据表移除对应条目即可，不会影响其他功能。'],
        ['怎么加入自己写的工具？', '新建一个 HTML 页面放进根目录，然后在工具数据文件里追加一条包含名称、文件名与分类的记录即可。'],
        ['是否包含广告与统计代码？', '源码保持干净，不预置任何广告或第三方统计。如需接入可自行在模板 head 中添加。']
      ]
    },
    en: {
      intro: 'Complete online toolbox website source code: a card-based aggregation homepage with search, category filters, favourites and recent history, ready to rebrand as your own.',
      body: 'This is a working skeleton for a tool site. The homepage handles aggregation and search while each tool is a standalone HTML page with no coupling between them, so deleting one affects nothing else. To add your own, write an HTML file following the same structure and register it in the data table — the matching card appears automatically. Every tool page shares one set of style variables, so a single colour change propagates site-wide.',
      faq: [
        ['Can I keep only some of the tools?', 'Yes. Each tool is a standalone page — delete the file and remove its row from the data table, and nothing else breaks.'],
        ['How do I add a tool I wrote myself?', 'Drop a new HTML page into the root directory and append a record with its name, filename and category to the tool data file.'],
        ['Does it include ads or analytics?', 'No. The source ships clean with no preloaded advertising or third-party tracking; add your own in the template head if needed.']
      ]
    }
  },
  newsrc: {
    zh: {
      intro: '资讯与企业站源码，含文章列表、详情页、分类聚合与多页企业站结构，SEO 友好，静态部署即可上线。',
      body: '内容型站点最看重的是收录，所以这套源码在结构上做了针对性处理：每篇文章是独立 URL 而非前端路由，标题与描述写在 HTML 里而非由 JavaScript 注入，分类页会自动生成面包屑与结构化数据。企业站部分提供首页、产品、关于、联系四类页面骨架，共用同一套导航与页脚组件。',
      faq: [
        ['为什么不用前端路由？', '前端路由生成的 URL 依赖 JavaScript 执行，部分爬虫抓取不完整。独立 HTML 文件收录更稳妥，也便于 CDN 缓存。'],
        ['自带结构化数据吗？', '自带。文章页输出 Article 类型的 JSON-LD，分类页输出面包屑，可直接通过富媒体测试。'],
        ['能对接 CMS 吗？', '可以。源码只约定了数据结构，任何能输出静态 HTML 的生成流程都可以对接，也可自行写脚本批量生成。']
      ]
    },
    en: {
      intro: 'News portal and corporate website source code in static HTML: article lists, detail pages, category aggregation and multi-page company site structure, SEO ready.',
      body: 'Content sites live or die by indexing, so this source is built around it: every article is a real URL rather than a client-side route, titles and descriptions sit in the HTML instead of being injected by JavaScript, and category pages emit breadcrumbs and structured data automatically. The corporate side supplies home, product, about and contact page skeletons that share one navigation and footer component.',
      faq: [
        ['Why avoid client-side routing?', 'Routed URLs depend on JavaScript execution and some crawlers fetch them incompletely. Real HTML files index more reliably and cache better on a CDN.'],
        ['Is structured data included?', 'Yes. Article pages output Article JSON-LD and category pages output breadcrumbs, both passing the rich results test as shipped.'],
        ['Can it connect to a CMS?', 'Yes. The source only defines a data structure, so any pipeline that can emit static HTML will work, including a custom generation script.']
      ]
    }
  }
};

module.exports = { TOOL, THEME, SOURCE };
