## URL PATH
**[user]**  
/  
/login  
/register  
/search  
/item  
/cart  

**[admin]**  
/admin  
/admin/product-manage  
/admin/product-manage/add  


## DB TABLE

**[products]**
| カラム名 | 名前 | 型 |
| ---- | ---- | ---- |
| itemcd | 商品コード（PK） | int |
| itemname | 商品名 | varchar |
| itemprice | 価格 | decimal |
| description | 説明文 | mediumtext |
| filepath | 商品画像パス | mediumtext |

**[customer]**
| カラム名 | 名前 | 型 |
| ---- | ---- | ---- |
| username | アカウント名 | text |
| email* | メールアドレス | text |
| zip | 郵便番号 | text |
| address | 住所 | text |
| passwd | ハッシュ化パスワード | text |