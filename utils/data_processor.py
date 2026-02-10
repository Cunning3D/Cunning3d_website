"""
数据处理模块 - 提供数据清理、过滤、转换和统计功能
"""

from numbers import Number
from typing import Any, Callable, Dict, List, Optional, Union


def clean_data(data_list: List[Any]) -> List[Any]:
    """
    清理数据列表，移除 None 值和空字符串

    Args:
        data_list: 需要清理的数据列表

    Returns:
        清理后的数据列表，不包含 None 和空字符串

    Raises:
        TypeError: 当输入不是列表时抛出
    """
    try:
        if not isinstance(data_list, list):
            raise TypeError(
                f"期望输入为列表类型，实际接收到: {type(data_list).__name__}"
            )

        cleaned = [item for item in data_list if item is not None and item != ""]
        return cleaned

    except Exception as e:
        print(f"清理数据时发生错误: {str(e)}")
        return []


def filter_by_condition(
    data_list: List[Any], condition_func: Callable[[Any], bool]
) -> List[Any]:
    """
    根据条件函数过滤数据列表

    Args:
        data_list: 需要过滤的数据列表
        condition_func: 返回布尔值的判断函数，接收一个参数

    Returns:
        满足条件的元素列表

    Raises:
        TypeError: 当输入不是列表或 condition_func 不是可调用的
    """
    try:
        if not isinstance(data_list, list):
            raise TypeError(
                f"期望 data_list 为列表类型，实际接收到: {type(data_list).__name__}"
            )

        if not callable(condition_func):
            raise TypeError("condition_func 必须是可调用的函数")

        filtered = [item for item in data_list if condition_func(item)]
        return filtered

    except Exception as e:
        print(f"过滤数据时发生错误: {str(e)}")
        return []


def transform_data(
    data_list: List[Any], transform_func: Callable[[Any], Any]
) -> List[Any]:
    """
    对数据应用转换函数

    Args:
        data_list: 需要转换的数据列表
        transform_func: 转换函数，接收一个参数并返回转换后的值

    Returns:
        转换后的数据列表

    Raises:
        TypeError: 当输入不是列表或 transform_func 不是可调用的
    """
    try:
        if not isinstance(data_list, list):
            raise TypeError(
                f"期望 data_list 为列表类型，实际接收到: {type(data_list).__name__}"
            )

        if not callable(transform_func):
            raise TypeError("transform_func 必须是可调用的函数")

        transformed = [transform_func(item) for item in data_list]
        return transformed

    except Exception as e:
        print(f"转换数据时发生错误: {str(e)}")
        return []


def calculate_statistics(
    data_list: List[Number],
) -> Dict[str, Optional[Union[int, float]]]:
    """
    计算数值列表的基本统计信息

    Args:
        data_list: 包含数值的列表

    Returns:
        包含统计信息的字典，键包括: max, min, average, sum, count
        如果输入为空列表或发生错误，返回 None 值的字典

    Raises:
        TypeError: 当输入不是列表时抛出
    """
    try:
        if not isinstance(data_list, list):
            raise TypeError(
                f"期望输入为列表类型，实际接收到: {type(data_list).__name__}"
            )

        # 过滤出有效的数值
        valid_numbers = [
            x
            for x in data_list
            if isinstance(x, (int, float)) and not isinstance(x, bool)
        ]

        if not valid_numbers:
            return {"max": None, "min": None, "average": None, "sum": None, "count": 0}

        total = sum(valid_numbers)
        count = len(valid_numbers)
        average = total / count
        max_val = max(valid_numbers)
        min_val = min(valid_numbers)

        return {
            "max": max_val,
            "min": min_val,
            "average": average,
            "sum": total,
            "count": count,
        }

    except Exception as e:
        print(f"计算统计信息时发生错误: {str(e)}")
        return {"max": None, "min": None, "average": None, "sum": None, "count": 0}


if __name__ == "__main__":
    # 示例用法

    print("=" * 50)
    print("数据处理模块示例")
    print("=" * 50)

    # 1. 测试 clean_data
    print("\n1. 清理数据 (clean_data):")
    raw_data = [1, None, "hello", "", 42, None, "world", "", 3.14]
    print(f"原始数据: {raw_data}")
    cleaned = clean_data(raw_data)
    print(f"清理后: {cleaned}")

    # 2. 测试 filter_by_condition
    print("\n2. 条件过滤 (filter_by_condition):")
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    print(f"原始数据: {numbers}")
    # 过滤出偶数
    evens = filter_by_condition(numbers, lambda x: x % 2 == 0)
    print(f"偶数: {evens}")
    # 过滤出大于5的数
    greater_than_five = filter_by_condition(numbers, lambda x: x > 5)
    print(f"大于5的数: {greater_than_five}")

    # 3. 测试 transform_data
    print("\n3. 数据转换 (transform_data):")
    print(f"原始数据: {numbers}")
    # 每个数平方
    squared = transform_data(numbers, lambda x: x**2)
    print(f"平方: {squared}")
    # 每个数转为字符串
    as_strings = transform_data(numbers, lambda x: f"Number-{x}")
    print(f"转为字符串: {as_strings}")

    # 4. 测试 calculate_statistics
    print("\n4. 统计计算 (calculate_statistics):")
    stats_data = [10, 20, 30, 40, 50]
    print(f"数据: {stats_data}")
    stats = calculate_statistics(stats_data)
    print("统计结果:")
    for key, value in stats.items():
        print(f"  {key}: {value}")

    # 测试包含无效数据的统计
    print("\n包含非数字数据的统计:")
    mixed_data = [10, 20, "invalid", None, 30, 40]
    print(f"数据: {mixed_data}")
    stats_mixed = calculate_statistics(mixed_data)
    print("统计结果:")
    for key, value in stats_mixed.items():
        print(f"  {key}: {value}")

    # 测试错误处理
    print("\n5. 错误处理测试:")
    print("传入非列表类型:")
    result = clean_data("not a list")
    print(f"结果: {result}")

    print("\n" + "=" * 50)
    print("示例运行完毕!")
    print("=" * 50)
