/* =========================================================================
   CSIS3280 Week 06 · PHP 面向对象代码填空 —— 练习数据
   -------------------------------------------------------------------------
   题目来源：week06_starter（未完成代码）
   参考答案：week06_demo（教师完整代码）
   -------------------------------------------------------------------------
   骨架中的标记：
     单独一行的  @@blankId@@  -> 多行代码输入框
     行内的        @@blankId@@  -> 单行输入框
   blank 结构：
     { id, label, placeholder, solution, rows?, size?, checks: [{ re, tip, min? }] }
     checks 全部命中才算正确；tip 在未命中时给学生看。
   ========================================================================= */

(function () {
  'use strict';

  /* ---------- 原始文件（starter 原样内容，用于「查看原代码」） ---------- */

  const PRODUCT_STARTER = String.raw`<?php
class Product
{
    // property

    // magic method
    // constructor
    // toString

    // getter and setter

    // custom methods

}`;

  const VEHICLE_STARTER = String.raw`<?php
abstract class Vehicle
{
    private string $makeModel; // start with private method
    private int $numPassengers;
    private float $topSpeed;

    public function getMakeModel(): string
    {
        return $this->makeModel;
    }

    public function setMakeModel(string $makeModel): void
    {
        $this->makeModel = $makeModel;
    }

    public function getNumPassengers(): int
    {
        return $this->numPassengers;
    }

    public function setNumPassengers(int $numPassengers): void
    {
        $this->numPassengers = $numPassengers;
    }

    public function getTopSpeed(): float
    {
        return $this->topSpeed;
    }

    public function setTopSpeed(float $topSpeed): void
    {
        $this->topSpeed = $topSpeed;
    }
}`;

  const FOOD_SOURCE = String.raw`<?php
class Food
{
    protected string $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function __toString(): string
    {
        return "(FOOD) $this->name";
    }
}`;

  const DESSERT_STARTER = String.raw`<?php

class Dessert extends Food
{
    // promotion
    public function __construct(string $name, int $calories)
    {
        
    }

    public function __toString(): string
    {
        // augmentation
        
    }

    public function setCalories(int $calories)
    {
        $this->calories = $calories;
    }
}`;

  const EMPTY_INDEX = String.raw`<?php
`;

  /* ------------------------------- 题目 ------------------------------- */

  const chapters = [
    {
      id: 'ch18',
      title: 'CH18',
      subtitle: '类与对象 · Product',
      questions: [
        /* ---------------- 第 1 题 ---------------- */
        {
          id: 'q1',
          title: 'Product：属性声明与构造方法',
          file: 'CH18/src/Product.php',
          tags: ['属性声明', '访问修饰符', '构造方法', '封装'],
          desc:
            '补全 <code>Product</code> 类的两个私有属性和构造方法。构造方法接收价格与名称，' +
            '并且要通过 <strong>setter</strong> 赋值 —— 这样 <code>setPrice()</code> 里的价格校验才会生效。',
          hint: [
            '属性需要访问修饰符 + 类型声明：<code>private string $name;</code> 与 <code>private float $price;</code>。',
            '构造方法是魔术方法，方法名为 <code>__construct</code>；参考答案的参数顺序是 <code>(float $price, string $name)</code>。',
            '不要直接写 <code>$this->price = $price;</code>。题目要求调用 <code>$this->setPrice($price)</code>，把校验逻辑留在 setter 里。'
          ],
          skeleton: String.raw`<?php
class Product
{
    // property
@@propName@@
@@propPrice@@

    // magic method
    // constructor
@@ctor@@

    // toString
    // getter and setter
    // （第 2 题继续完成 __toString 与访问器）

    // custom methods
}`,
          blanks: [
            {
              id: 'propName',
              label: '属性声明 · string $name',
              placeholder: '// 声明名称属性',
              rows: 1,
              solution: 'private string $name;',
              checks: [
                { re: /private\s+string\s+\$name\s*;/, tip: '名称属性要写成 <code>private string $name;</code>' }
              ]
            },
            {
              id: 'propPrice',
              label: '属性声明 · float $price',
              placeholder: '// 声明价格属性',
              rows: 1,
              solution: 'private float $price;',
              checks: [
                { re: /private\s+float\s+\$price\s*;/, tip: '价格属性要写成 <code>private float $price;</code>' }
              ]
            },
            {
              id: 'ctor',
              label: '构造方法 __construct',
              placeholder: '// 参数：(float $price, string $name)',
              rows: 5,
              solution: 'public function __construct(float $price, string $name)\n{\n    $this->setPrice($price);\n    $this->setName($name);\n}',
              checks: [
                { re: /function\s+__construct\s*\(/, tip: '缺少 <code>__construct()</code> 方法' },
                {
                  re: /float\s+\$price\s*,\s*string\s+\$name|string\s+\$name\s*,\s*float\s+\$price/,
                  tip: '两个参数的类型应为 <code>float $price</code> 与 <code>string $name</code>'
                },
                { re: /\$this\s*->\s*setPrice\s*\(\s*\$price\s*\)/, tip: '缺少 <code>$this->setPrice($price);</code>' },
                { re: /\$this\s*->\s*setName\s*\(\s*\$name\s*\)/, tip: '缺少 <code>$this->setName($name);</code>' }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH18/src/Product.php',
              note: 'starter 原始文件：只有注释框架，属性、构造方法、魔术方法、访问器全部留空。',
              code: PRODUCT_STARTER
            }
          ]
        },

        /* ---------------- 第 2 题 ---------------- */
        {
          id: 'q2',
          title: 'Product：__toString、getter 与 setter',
          file: 'CH18/src/Product.php',
          tags: ['魔术方法', 'getter / setter', '数据校验'],
          desc:
            '接着上一题补全 <code>__toString()</code> 与四个访问器。' +
            '<code>setPrice()</code> 里要做校验：价格为负数时不写入属性。',
          hint: [
            '<code>__toString()</code> 必须返回字符串，拼接用 <code>.</code>，输出格式：<code>(Product) name: hammer and price 9.99</code>。',
            '带返回类型的方法写法：<code>public function getName(): string</code>；不带返回值用 <code>: void</code>。',
            '<code>setPrice()</code> 里加 <code>if ($price &gt;= 0) { ... }</code>，非法价格直接丢弃。',
            '把对象直接放进双引号字符串（<code>"{$product}"</code>）时，PHP 会自动调用 <code>__toString()</code>。'
          ],
          skeleton: String.raw`<?php
class Product
{
    // property
    private string $name;
    private float $price;

    // magic method
    // constructor
    public function __construct(float $price, string $name)
    {
        $this->setPrice($price);
        $this->setName($name);
    }
    // toString
@@toString@@

    // getter and setter
@@accessors@@

    // custom methods
}`,
          blanks: [
            {
              id: 'toString',
              label: '__toString()',
              placeholder: '// 返回 (Product) name: ... and price ...',
              rows: 4,
              solution: "public function __toString()\n{\n    return '(Product) name: ' . $this->name . ' and price ' . $this->price;\n}",
              checks: [
                { re: /function\s+__toString\s*\(/, tip: '缺少 <code>__toString()</code> 方法' },
                { re: /\(Product\)/, tip: '返回内容里要有 <code>(Product)</code> 前缀' },
                { re: /\$this\s*->\s*name/, tip: '返回内容要拼接 <code>$this->name</code>' },
                { re: /\$this\s*->\s*price/, tip: '返回内容要拼接 <code>$this->price</code>' },
                { re: /return\s/, tip: '需要用 <code>return</code> 返回字符串' }
              ]
            },
            {
              id: 'accessors',
              label: 'getter 与 setter（4 个方法）',
              placeholder: '// setName / getName / setPrice / getPrice',
              rows: 9,
              solution:
                'public function setName(string $name): void\n{\n    $this->name = $name;\n}\npublic function getName(): string\n{\n    return $this->name;\n}\npublic function setPrice(float $price): void\n{\n    if ($price >= 0) {\n        $this->price = $price;\n    }\n}\npublic function getPrice(): float\n{\n    return $this->price;\n}',
              checks: [
                { re: /function\s+setName\s*\(\s*string\s+\$name\s*\)/, tip: '缺少 <code>setName(string $name)</code>' },
                { re: /function\s+getName\s*\(\s*\)\s*:\s*string/, tip: '缺少 <code>getName(): string</code>' },
                { re: /function\s+setPrice\s*\(\s*float\s+\$price\s*\)/, tip: '缺少 <code>setPrice(float $price)</code>' },
                { re: /function\s+getPrice\s*\(\s*\)\s*:\s*float/, tip: '缺少 <code>getPrice(): float</code>' },
                { re: /\$this\s*->\s*name\s*=\s*\$name/, tip: 'setter 里要给 <code>$this->name</code> 赋值' },
                { re: /\$this\s*->\s*price\s*=\s*\$price/, tip: 'setter 里要给 <code>$this->price</code> 赋值' },
                {
                  re: /if\s*\(\s*\$price\s*>=\s*0\s*\)|if\s*\(\s*\$price\s*>\s*-1\s*\)/,
                  tip: 'setPrice() 缺少价格校验：<code>if ($price &gt;= 0)</code>'
                }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH18/src/Product.php',
              note: 'starter 原始文件。本题作答时，第 1 题的部分已作为背景代码补全显示。',
              code: PRODUCT_STARTER
            }
          ]
        },

        /* ---------------- 第 3 题 ---------------- */
        {
          id: 'q3',
          title: '使用 Product：public/index.php',
          file: 'CH18/public/index.php',
          tags: ['实例化', '方法调用', '字符串插值'],
          desc:
            '这个脚本在 starter 里是<strong>空文件</strong>，需要从零完成：引入 <code>Product</code> 类，' +
            '创建对象，调用 setter 修改属性，并把对象/属性打印出来。',
          hint: [
            '引入类文件：<code>require_once \'../src/Product.php\';</code>',
            '先 <code>$product = new Product(0, \'\');</code>，再用 <code>setName()</code> / <code>setPrice()</code> 改值。',
            '连续调用 <code>setPrice(9.99)</code>、<code>setPrice(-100)</code>，观察最后一次为什么不生效（校验逻辑）。',
            '输出用 <code>print</code>；<code>"The object product is {$product}"</code> 会触发 <code>__toString()</code>。'
          ],
          skeleton: String.raw`<?php
@@body@@`,
          blanks: [
            {
              id: 'body',
              label: '完整脚本（require → 实例化 → 调用 → 输出）',
              placeholder: "require_once '../src/Product.php';\n\n// 实例化、调用方法、打印结果",
              rows: 16,
              solution: String.raw`require_once '../src/Product.php';

// instantiate a new object
$product = new Product(0, '');
$product->setName('hammer');
$product->setPrice(9.99);
$product->setPrice(0.99);
$product->setPrice(-100);

$product2 = new Product(100, 'nail');

print "Procuct price is {$product->getPrice()}\n";
print "The object product is {$product}\n";
print "The object product is {$product2}";`,
              checks: [
                {
                  re: /require(_once)?\s*(\(\s*)?['"]\.\.\/src\/Product\.php['"]/,
                  tip: '需要 <code>require_once \'../src/Product.php\';</code>'
                },
                { re: /new\s+Product\s*\(/, tip: '还没有实例化：<code>new Product(...)</code>' },
                { re: /->\s*setName\s*\(/, tip: '需要调用 <code>setName()</code>' },
                { re: /->\s*setPrice\s*\(/, tip: '需要调用 <code>setPrice()</code>' },
                { re: /->\s*getPrice\s*\(/, tip: '需要调用 <code>getPrice()</code> 读取价格' },
                { re: /(print|echo)/, tip: '需要用 <code>print</code> 或 <code>echo</code> 输出结果' },
                { re: /new\s+Product\s*\(/, min: 2, tip: '原代码创建了两个对象，试试 <code>new Product()</code> 两个' }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH18/public/index.php',
              note: 'starter 原始文件：内容只有 <?php 一行，整段代码都需要你自己写。',
              code: EMPTY_INDEX
            },
            {
              path: 'CH18/src/Product.php（题目文件）',
              note: '本题要调用的类。只看结构即可，不要修改。',
              code: PRODUCT_STARTER
            }
          ]
        }
      ]
    },

    {
      id: 'ch19-demo1',
      title: 'CH19 · demo1',
      subtitle: '继承与访问修饰符 · Vehicle / Car',
      questions: [
        /* ---------------- 第 4 题 ---------------- */
        {
          id: 'q4',
          title: 'Vehicle：让子类可以读取 $makeModel',
          file: 'CH19/demo1/src/Vehicle.php',
          tags: ['访问修饰符', 'protected'],
          desc:
            'starter 里 <code>$makeModel</code> 声明为 <code>private</code>，但子类 <code>Car</code> 的 ' +
            '<code>getMakeModelShape()</code> 要直接读取 <code>$this->makeModel</code>。请填入正确的访问修饰符。',
          hint: [
            '<code>private</code> 只有本类能访问；<code>protected</code> 本类 + 子类可访问；<code>public</code> 任何地方都能访问。',
            '子类需要直接访问属性 → 用 <code>protected</code>，同时不对外暴露。',
            '如果保持 <code>private</code>，子类读取 <code>$this->makeModel</code> 会报 <code>Undefined property</code>。'
          ],
          skeleton: String.raw`<?php
abstract class Vehicle
{
    @@modifier@@ string $makeModel; // start with private method
    private int $numPassengers;
    private float $topSpeed;

    public function getMakeModel(): string
    {
        return $this->makeModel;
    }

    public function setMakeModel(string $makeModel): void
    {
        $this->makeModel = $makeModel;
    }

    public function getNumPassengers(): int
    {
        return $this->numPassengers;
    }

    public function setNumPassengers(int $numPassengers): void
    {
        $this->numPassengers = $numPassengers;
    }

    public function getTopSpeed(): float
    {
        return $this->topSpeed;
    }

    public function setTopSpeed(float $topSpeed): void
    {
        $this->topSpeed = $topSpeed;
    }
}`,
          blanks: [
            {
              id: 'modifier',
              kind: 'inline',
              label: '访问修饰符',
              placeholder: 'modifier',
              size: 9,
              solution: 'protected',
              checks: [
                {
                  re: /^\s*protected\s*$/i,
                  tip: '这里应该是 <code>protected</code>：子类 Car 需要直接读取，同时又不想对类外暴露'
                }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH19/demo1/src/Vehicle.php',
              note: 'starter 原始文件：注意第 4 行 $makeModel 用的是 private。',
              code: VEHICLE_STARTER
            }
          ]
        },

        /* ---------------- 第 5 题 ---------------- */
        {
          id: 'q5',
          title: 'Car：继承 Vehicle 并新增 $bodyShape',
          file: 'CH19/demo1/src/Car.php',
          tags: ['继承', 'extends', '字符串插值'],
          desc:
            'starter 里<strong>没有</strong>这个文件，需要你新建：<code>Car</code> 继承 <code>Vehicle</code>，' +
            '新增 public 属性 <code>$bodyShape</code>，并提供 <code>getMakeModelShape()</code> 返回 ' +
            '<code>makeModel, bodyShape</code>。',
          hint: [
            '类声明：<code>class Car extends Vehicle { ... }</code>。',
            '只需要声明父类没有的属性：<code>public string $bodyShape;</code>，不要重复声明 <code>$makeModel</code>。',
            '字符串插值写法：<code>return "{$this->makeModel}, {$this->bodyShape}";</code>',
            '能直接读 <code>$this->makeModel</code> 的前提，是第 4 题把它改成了 <code>protected</code>。'
          ],
          skeleton: String.raw`<?php

@@body@@`,
          blanks: [
            {
              id: 'body',
              label: 'class Car 的完整定义',
              placeholder: '// class Car extends Vehicle { ... }',
              rows: 9,
              solution:
                'class Car extends Vehicle{\n    public string $bodyShape;\n\n    public function getMakeModelShape(){\n        return "{$this->makeModel}, {$this->bodyShape}";\n    }\n}',
              checks: [
                { re: /class\s+Car\s+extends\s+Vehicle/, tip: '需要 <code>class Car extends Vehicle</code>' },
                { re: /public\s+string\s+\$bodyShape\s*;/, tip: '缺少 <code>public string $bodyShape;</code>' },
                { re: /function\s+getMakeModelShape\s*\(/, tip: '缺少 <code>getMakeModelShape()</code> 方法' },
                { re: /\{\$this\s*->\s*makeModel\}/, tip: '返回值里要用 <code>{$this->makeModel}</code> 插值' },
                { re: /\{\$this\s*->\s*bodyShape\}/, tip: '返回值里要用 <code>{$this->bodyShape}</code> 插值' }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH19/demo1/src/Car.php',
              note: 'starter 中不存在该文件 —— 本题就是从空文件开始新建。',
              code: "<?php\n\n// 该文件在 starter 中不存在，需要你新建 class Car extends Vehicle\n"
            },
            {
              path: 'CH19/demo1/src/Vehicle.php（父类）',
              note: '父类定义，注意 $makeModel 的可访问性。',
              code: VEHICLE_STARTER
            }
          ]
        },

        /* ---------------- 第 6 题 ---------------- */
        {
          id: 'q6',
          title: '使用 Car：demo1/public/index.php',
          file: 'CH19/demo1/public/index.php',
          tags: ['实例化', '对象属性赋值', 'var_dump'],
          desc:
            'starter 中是空文件。请引入父类与子类，创建 <code>Car</code> 对象，给 <code>bodyShape</code> 与 ' +
            '<code>makeModel</code> 赋值并输出结果。',
          hint: [
            '子类和父类都要引入：<code>require_once \'../src/Vehicle.php\';</code> 与 <code>require_once \'../src/Car.php\';</code>',
            '<code>new Car()</code> 不需要参数（Vehicle 没有构造方法）。',
            'public 属性可以直接赋值：<code>$car->bodyShape = \'sedan\';</code>；private/protected 的 <code>$makeModel</code> 要通过 <code>setMakeModel()</code>。',
            '用 <code>var_dump($car)</code> 观察对象的全部属性。'
          ],
          skeleton: String.raw`<?php
@@body@@`,
          blanks: [
            {
              id: 'body',
              label: '完整脚本（require → new Car → 赋值 → 输出）',
              placeholder: "require_once '../src/Vehicle.php';\nrequire_once '../src/Car.php';\n\n// ...",
              rows: 12,
              solution: String.raw`require_once '../src/Vehicle.php';
require_once '../src/Car.php';

$car = new Car();
$car->bodyShape = 'sedan';
$car->setMakeModel('Ford Mustang');
print $car->getMakeModelShape();
var_dump($car);`,
              checks: [
                {
                  re: /require(_once)?\s*(\(\s*)?['"]\.\.\/src\/Vehicle\.php['"]/,
                  tip: '需要引入 <code>../src/Vehicle.php</code>'
                },
                {
                  re: /require(_once)?\s*(\(\s*)?['"]\.\.\/src\/Car\.php['"]/,
                  tip: '需要引入 <code>../src/Car.php</code>'
                },
                { re: /new\s+Car\s*\(\s*\)/, tip: '需要 <code>$car = new Car();</code>' },
                { re: /->\s*bodyShape\s*=/, tip: '需要给 <code>$car->bodyShape</code> 赋值' },
                { re: /->\s*setMakeModel\s*\(/, tip: 'protected 属性要通过 <code>setMakeModel()</code> 赋值' },
                { re: /->\s*getMakeModelShape\s*\(/, tip: '需要调用 <code>getMakeModelShape()</code>' },
                { re: /var_dump\s*\(/, tip: '最后用 <code>var_dump($car)</code> 查看对象' }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH19/demo1/public/index.php',
              note: 'starter 原始文件：只有 <?php，内容全部需要自己写。',
              code: EMPTY_INDEX
            }
          ]
        }
      ]
    },

    {
      id: 'ch19-demo2',
      title: 'CH19 · demo2',
      subtitle: '方法增强 · Food / Dessert',
      questions: [
        /* ---------------- 第 7 题 ---------------- */
        {
          id: 'q7',
          title: 'Dessert：构造方法里的方法增强',
          file: 'CH19/demo2/src/Dessert.php',
          tags: ['parent::__construct', '方法增强'],
          desc:
            '<code>Dessert</code> 继承 <code>Food</code>，但构造方法要额外处理热量。请用 <strong>方法增强</strong> ' +
            '的方式补全构造方法体：先调用父类构造，再设置热量。',
          hint: [
            '复用父类逻辑：<code>parent::__construct($name);</code> —— 不要重复写 <code>$this->name = $name;</code>。',
            '接着调用自己（或父类继承来的）方法：<code>$this->setCalories($calories);</code>',
            '<code>parent::__construct()</code> 必须写在子类构造方法里，否则 <code>$name</code> 不会被赋值。'
          ],
          skeleton: String.raw`<?php

class Dessert extends Food
{
    // promotion
    public function __construct(string $name, int $calories)
    {
@@ctorBody@@
    }

    public function __toString(): string
    {
        // augmentation
        // （__toString 的重写见下一题）
    }

    public function setCalories(int $calories)
    {
        $this->calories = $calories;
    }
}`,
          blanks: [
            {
              id: 'ctorBody',
              label: '构造方法体（方法增强）',
              placeholder: '// 先调用父类构造方法，再设置 calories',
              rows: 3,
              solution: '// augmentation\nparent::__construct($name);\n$this->setCalories($calories);',
              checks: [
                {
                  re: /parent\s*::\s*__construct\s*\(\s*\$name\s*\)/,
                  tip: '缺少 <code>parent::__construct($name);</code>'
                },
                {
                  re: /\$this\s*->\s*setCalories\s*\(\s*\$calories\s*\)/,
                  tip: '缺少 <code>$this->setCalories($calories);</code>'
                }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH19/demo2/src/Dessert.php',
              note: 'starter 原始文件：构造方法与 __toString 的方法体都是空的。',
              code: DESSERT_STARTER
            },
            {
              path: 'CH19/demo2/src/Food.php（父类）',
              note: '父类提供 protected $name 与 __construct(string $name)。',
              code: FOOD_SOURCE
            }
          ]
        },

        /* ---------------- 第 8 题 ---------------- */
        {
          id: 'q8',
          title: 'Dessert：重写 __toString 追加热量信息',
          file: 'CH19/demo2/src/Dessert.php',
          tags: ['方法重写', 'parent::__toString', '字符串累加'],
          desc:
            '重写 <code>__toString()</code>：先取父类的输出，再追加自己的热量信息，返回完整字符串。这也是方法增强的经典写法。',
          hint: [
            '第一步取父类结果：<code>$message = parent::__toString();</code>',
            '第二步累加：<code>$message .= "I am a Desset with {$this->calories} calories";</code>（原代码里 Desset 是笔误，写 Dessert 也可以）',
            '最后 <code>return $message;</code> —— 千万不要漏掉 return，否则 <code>print</code> 会报错。'
          ],
          skeleton: String.raw`<?php

class Dessert extends Food
{
    // promotion
    public function __construct(string $name, int $calories)
    {
        // augmentation
        parent::__construct($name);
        $this->setCalories($calories);
    }

    public function __toString(): string
    {
        // augmentation
@@toString@@
    }

    public function setCalories(int $calories)
    {
        $this->calories = $calories;
    }
}`,
          blanks: [
            {
              id: 'toString',
              label: '__toString() 方法体',
              placeholder: '// $message = parent::__toString(); ...',
              rows: 5,
              solution:
                '$message = parent::__toString();\n$message .= "I am a Dessert with {$this->calories} calories";\n\nreturn $message;',
              checks: [
                { re: /parent\s*::\s*__toString\s*\(\s*\)/, tip: '缺少 <code>parent::__toString()</code>' },
                { re: /\.=/, tip: '需要用 <code>.=</code> 把新内容累加到 <code>$message</code> 后面' },
                { re: /\$this\s*->\s*calories/, tip: '输出内容里要包含 <code>{$this->calories}</code>' },
                { re: /return\s/, tip: '方法必须 <code>return</code> 一个字符串' }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH19/demo2/src/Dessert.php',
              note: 'starter 原始文件：本题只填 __toString 的方法体，构造方法已作为背景补全。',
              code: DESSERT_STARTER
            },
            {
              path: 'CH19/demo2/src/Food.php（父类）',
              note: '父类的 __toString() 返回 "(FOOD) $name"。',
              code: FOOD_SOURCE
            }
          ]
        },

        /* ---------------- 第 9 题 ---------------- */
        {
          id: 'q9',
          title: '使用 Dessert：demo2/public/index.php',
          file: 'CH19/demo2/public/index.php',
          tags: ['实例化', '__toString', 'var_dump'],
          desc:
            'starter 中是空文件。请引入 <code>Food</code> 与 <code>Dessert</code>，创建一个甜点对象，' +
            '直接用 <code>print</code> 打印对象（自动触发 <code>__toString()</code>），再用 <code>var_dump()</code> 观察结构。',
          hint: [
            '两个文件都要引入：<code>../src/Food.php</code>、<code>../src/Dessert.php</code>。',
            '构造方法是 <code>(string $name, int $calories)</code>：<code>new Dessert(\'Apple pie\', 100);</code>',
            '<code>print $food;</code> 会自动调用 <code>__toString()</code>，输出包含父类与子类两段内容。'
          ],
          skeleton: String.raw`<?php
@@body@@`,
          blanks: [
            {
              id: 'body',
              label: '完整脚本（require → new Dessert → print → var_dump）',
              placeholder: "require_once '../src/Food.php';\nrequire_once '../src/Dessert.php';\n\n// ...",
              rows: 10,
              solution: String.raw`require_once '../src/Food.php';
require_once '../src/Dessert.php';


$food = new Dessert('Apple pie', 100);

print $food;
var_dump($food);`,
              checks: [
                {
                  re: /require(_once)?\s*(\(\s*)?['"]\.\.\/src\/Food\.php['"]/,
                  tip: '需要引入 <code>../src/Food.php</code>'
                },
                {
                  re: /require(_once)?\s*(\(\s*)?['"]\.\.\/src\/Dessert\.php['"]/,
                  tip: '需要引入 <code>../src/Dessert.php</code>'
                },
                {
                  re: /new\s+Dessert\s*\(\s*['"][^'"]+['"]\s*,\s*\d+\s*\)/,
                  tip: '需要 <code>new Dessert(\'Apple pie\', 100)</code> 这样的两个参数'
                },
                { re: /(print|echo)\s+\$(\w+)/, tip: '需要用 <code>print $food;</code> 打印对象' },
                { re: /var_dump\s*\(/, tip: '最后用 <code>var_dump($food)</code> 查看对象结构' }
              ]
            }
          ],
          originalFiles: [
            {
              path: 'CH19/demo2/public/index.php',
              note: 'starter 原始文件：只有 <?php，内容全部需要自己写。',
              code: EMPTY_INDEX
            }
          ]
        }
      ]
    }
  ];

  window.EXERCISE_DATA = {
    meta: {
      title: 'Week 06 · PHP 面向对象代码填空',
      subtitle: 'CSIS3280 Backend Web Development · CH18 / CH19',
      starter: 'week06_starter',
      demo: 'week06_demo'
    },
    chapters: chapters
  };
})();
