"""
hello_world.py

一个简单的 Python 示例程序，演示基本函数定义和模块运行模式。
"""


def print_hello_world():
    """
    打印 "Hello, World!" 到控制台。

    Returns:
        None
    """
    print("Hello, World!")


def calculate_sum(a, b):
    """
    计算两个数字的和。

    Args:
        a (int/float): 第一个数字
        b (int/float): 第二个数字

    Returns:
        int/float: 两个数字的和
    """
    return a + b


def main():
    """
    主函数，演示程序的主要功能。

    Returns:
        None
    """
    print("=" * 40)
    print("欢迎使用 Hello World 程序")
    print("=" * 40)

    # 演示打印功能
    print("\n1. 打印功能演示：")
    print_hello_world()

    # 演示求和功能
    print("\n2. 求和功能演示：")
    num1 = 10
    num2 = 25
    result = calculate_sum(num1, num2)
    print(f"   {num1} + {num2} = {result}")

    # 另一个求和示例（使用浮点数）
    print("\n3. 浮点数求和演示：")
    float1 = 3.14
    float2 = 2.86
    float_result = calculate_sum(float1, float2)
    print(f"   {float1} + {float2} = {float_result}")

    print("\n" + "=" * 40)
    print("程序执行完毕，谢谢使用！")
    print("=" * 40)


# 当直接运行此文件时，执行 main() 函数
# 这确保了只有作为主程序运行时才执行代码
if __name__ == "__main__":
    main()
