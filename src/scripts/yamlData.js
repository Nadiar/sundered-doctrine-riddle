const defaultYaml = `
- L2L1R2:
    L2:
      Coords:
        - - 2526.77
          - 1100.96
        - - 2526.77
          - 316.34
        - - 1868.62
          - 321.5
        - - 1331.78
          - 316.34
        - - 1344.69
          - 207.94
    L1:
      Coords:
        - - 2361.59
          - 871.25
        - - 2090.59
          - 943.52
        - - 1847.97
          - 801.56
        - - 1899.59
          - 1343.57
        - - 1791.19
          - 1624.89
        - - 1334.36
          - 1619.73
        - - 1166.6
          - 1611.99
    R2:
      Coords:
        - - 2712.06
          - 857.27
        - - 2977.22
          - 961.94
        - - 3170.27
          - 315.32
        - - 3679.65
          - 319.97
        - - 3847.12
          - 215.31
- L2R2L1:
    L2:
      Coords:
        - - 2526.77
          - 1100.96
        - - 2526.77
          - 316.34
        - - 1868.62
          - 321.5
        - - 1331.78
          - 316.34
        - - 1344.69
          - 207.94
    R2:
      Coords:
        - - 2681.82
          - 861.92
        - - 2963.26
          - 957.28
        - - 3184.23
          - 319.97
        - - 3681.98
          - 315.32
        - - 3856.43
          - 215.31
    L1:
      Coords:
        - - 2360.84
          - 871.22
        - - 2081.73
          - 957.28
        - - 1853.78
          - 806.1
        - - 1897.98
          - 1345.72
        - - 1797.96
          - 1613.2
        - - 1321.14
          - 1620.18
        - - 1162.98
          - 1617.85
- L2L1R1:
    L2:
      Coords:
        - - 2526.77
          - 1100.96
        - - 2526.77
          - 316.34
        - - 1868.62
          - 321.5
        - - 1331.78
          - 316.34
        - - 1344.69
          - 207.94
    L1:
      Coords:
        - - 2361.59
          - 871.25
        - - 2090.59
          - 943.52
        - - 1847.97
          - 801.56
        - - 1899.59
          - 1343.57
        - - 1791.19
          - 1624.89
        - - 1334.36
          - 1619.73
        - - 1166.6
          - 1611.99
    R1:
      Coords:
        - - 2691.13
          - 857.27
        - - 2732.99
          - 524.66
        - - 3316.81
          - 694.45
        - - 3681.98
          - 692.13
        - - 3684.31
          - 1424.8
        - - 3905.27
          - 1424.8
- L2R2R1:
    L2:
      Coords:
        - - 2526.77
          - 1100.96
        - - 2526.77
          - 316.34
        - - 1868.62
          - 321.5
        - - 1331.78
          - 316.34
        - - 1344.69
          - 207.94
    R2:
      Coords:
        - - 2681.82
          - 861.92
        - - 2963.26
          - 957.28
        - - 3184.23
          - 319.97
        - - 3681.98
          - 315.32
        - - 3856.43
          - 215.31
    R1:
      Coords:
        - - 2360.84
          - 864.25
        - - 2849.29
          - 1185.23
        - - 2814.4
          - 1624.83
        - - 3219.12
          - 1624.83
        - - 3679.65
          - 1622.51
        - - 3895.97
          - 1434.1
- L2R1L1:
    L2:
      Coords:
        - - 2526.77
          - 1100.96
        - - 2526.77
          - 316.34
        - - 1868.62
          - 321.5
        - - 1331.78
          - 316.34
        - - 1344.69
          - 207.94
    R1:
      Coords:
        - - 2679.5
          - 866.57
        - - 2837.66
          - 1180.58
        - - 2812.07
          - 1622.51
        - - 3212.14
          - 1624.83
        - - 3675
          - 1620.18
        - - 3902.95
          - 1438.76
    L1:
      Coords:
        - - 2365.49
          - 859.59
        - - 2079.4
          - 954.96
        - - 1846.81
          - 799.12
        - - 1888.67
          - 1345.72
        - - 1802.61
          - 1613.2
        - - 1342.07
          - 1615.53
        - - 1169.95
          - 1620.18
- L2R1R2:
    L2:
      Coords:
        - - 2526.77
          - 1100.96
        - - 2526.77
          - 316.34
        - - 1868.62
          - 321.5
        - - 1331.78
          - 316.34
        - - 1344.69
          - 207.94
    R1:
      Coords:
        - - 2679.5
          - 866.57
        - - 2837.66
          - 1180.58
        - - 2812.07
          - 1622.51
        - - 3212.14
          - 1624.83
        - - 3675
          - 1620.18
        - - 3902.95
          - 1438.76
    R2:
      Coords:
        - - 2365.49
          - 864.25
        - - 2316.65
          - 524.66
        - - 2728.34
          - 533.96
        - - 3321.46
          - 703.76
        - - 3681.98
          - 692.13
        - - 3688.96
          - 313
        - - 3842.47
          - 219.96
- R2L2L1:
    R2:
      Coords:
        - - 2684.15
          - 864.25
        - - 2970.24
          - 968.91
        - - 3177.25
          - 319.97
        - - 3668.02
          - 315.32
        - - 3840.15
          - 217.63
    L2:
      Coords:
        - - 2514.35
          - 1100.17
        - - 2519.01
          - 320.98
        - - 1865.41
          - 316.33
        - - 1335.1
          - 309.35
        - - 1337.42
          - 216.31
    L1:
      Coords:
        - - 2360.84
          - 869.91
        - - 2077.07
          - 962.94
        - - 1849.13
          - 800.13
        - - 1886.35
          - 1349.05
        - - 1807.26
          - 1623.51
        - - 1330.44
          - 1614.21
        - - 1174.61
          - 1623.51
- R2R1L2:
    R2:
      Coords:
        - - 2684.15
          - 864.25
        - - 2970.24
          - 968.91
        - - 3177.25
          - 319.97
        - - 3668.02
          - 315.32
        - - 3840.15
          - 217.63
    R1:
      Coords:
        - - 2358.51
          - 867.58
        - - 2835.33
          - 1186.24
        - - 2809.75
          - 1614.21
        - - 3214.46
          - 1635.14
        - - 3665.7
          - 1630.49
        - - 3898.29
          - 1444.42
    L2:
      Coords:
        - - 2519.01
          - 1100.17
        - - 2516.68
          - 311.68
        - - 1858.43
          - 316.33
        - - 1342.07
          - 316.33
        - - 1339.75
          - 218.64
- R2L1L2:
    R2:
      Coords:
        - - 2684.15
          - 864.25
        - - 2970.24
          - 968.91
        - - 3177.25
          - 319.97
        - - 3668.02
          - 315.32
        - - 3840.15
          - 217.63
    L1:
      Coords:
        - - 2521.33
          - 1093.2
        - - 2339.91
          - 1411.85
        - - 2046.84
          - 1269.97
        - - 1874.72
          - 1351.38
        - - 1795.63
          - 1616.54
        - - 1332.77
          - 1621.19
        - - 1174.61
          - 1616.54
    L2:
      Coords:
        - - 2365.49
          - 865.25
        - - 2098.01
          - 960.62
        - - 1860.76
          - 323.31
        - - 1307.18
          - 318.66
        - - 1335.1
          - 220.97
- R2L2R1:
    R2:
      Coords:
        - - 2684.15
          - 864.25
        - - 2970.24
          - 968.91
        - - 3177.25
          - 319.97
        - - 3668.02
          - 315.32
        - - 3840.15
          - 217.63
    L2:
      Coords:
        - - 2514.35
          - 1100.17
        - - 2519.01
          - 320.98
        - - 1865.41
          - 316.33
        - - 1335.1
          - 309.35
        - - 1337.42
          - 216.31
    R1:
      Coords:
        - - 2367.82
          - 862.93
        - - 2849.29
          - 1188.56
        - - 2807.42
          - 1623.51
        - - 3216.79
          - 1623.51
        - - 3670.35
          - 1625.84
        - - 3891.32
          - 1449.07
- R2R1L1:
    R2:
      Coords:
        - - 2684.15
          - 864.25
        - - 2970.24
          - 968.91
        - - 3177.25
          - 319.97
        - - 3668.02
          - 315.32
        - - 3840.15
          - 217.63
    R1:
      Coords:
        - - 2358.51
          - 867.58
        - - 2835.33
          - 1186.24
        - - 2809.75
          - 1614.21
        - - 3214.46
          - 1635.14
        - - 3665.7
          - 1630.49
        - - 3898.29
          - 1444.42
    L1:
      Coords:
        - - 2519.01
          - 1100.17
        - - 2339.91
          - 1414.18
        - - 2051.49
          - 1267.64
        - - 1891
          - 1349.05
        - - 1797.96
          - 1616.54
        - - 1325.79
          - 1621.19
        - - 1165.3
          - 1618.86
- R2L1R1:
    R2:
      Coords:
        - - 2684.15
          - 864.25
        - - 2970.24
          - 968.91
        - - 3177.25
          - 319.97
        - - 3668.02
          - 315.32
        - - 3840.15
          - 217.63
    L1:
      Coords:
        - - 2521.33
          - 1093.2
        - - 2339.91
          - 1411.85
        - - 2046.84
          - 1269.97
        - - 1874.72
          - 1351.38
        - - 1795.63
          - 1616.54
        - - 1332.77
          - 1621.19
        - - 1174.61
          - 1616.54
    R1:
      Coords:
        - - 2360.84
          - 865.25
        - - 2849.29
          - 1181.58
        - - 2814.4
          - 1628.17
        - - 3221.44
          - 1623.51
        - - 3679.65
          - 1621.19
        - - 3891.32
          - 1442.09
- L1L2R2:
    L1:
      Coords:
        - - 2519.01
          - 1102.5
        - - 2332.93
          - 1416.5
        - - 2053.81
          - 1272.3
        - - 1891
          - 1346.73
        - - 1800.29
          - 1616.54
        - - 1339.75
          - 1616.54
        - - 1174.61
          - 1611.88
    L2:
      Coords:
        - - 2360.84
          - 872.23
        - - 2077.07
          - 958.29
        - - 1849.13
          - 309.35
        - - 1330.44
          - 320.98
        - - 1325.79
          - 220.97
    R2:
      Coords:
        - - 2686.47
          - 874.56
        - - 2963.26
          - 965.27
        - - 3174.92
          - 334.94
        - - 3679.65
          - 320.98
        - - 3844.8
          - 223.29
- L1R2L2:
    L1:
      Coords:
        - - 2519.01
          - 1102.5
        - - 2332.93
          - 1416.5
        - - 2053.81
          - 1272.3
        - - 1891
          - 1346.73
        - - 1800.29
          - 1616.54
        - - 1339.75
          - 1616.54
        - - 1174.61
          - 1611.88
    R2:
      Coords:
        - - 2688.8
          - 876.88
        - - 2942.33
          - 962.94
        - - 3172.6
          - 330.29
        - - 3677.33
          - 318.66
        - - 3847.12
          - 220.97
    L2:
      Coords:
        - - 2365.49
          - 862.93
        - - 2079.4
          - 958.29
        - - 1860.76
          - 320.98
        - - 1342.07
          - 314
        - - 1330.44
          - 220.97
- L1L2R1:
    L1:
      Coords:
        - - 2519.01
          - 1102.5
        - - 2332.93
          - 1416.5
        - - 2053.81
          - 1272.3
        - - 1891
          - 1346.73
        - - 1800.29
          - 1616.54
        - - 1339.75
          - 1616.54
        - - 1174.61
          - 1611.88
    L2:
      Coords:
        - - 2360.84
          - 872.23
        - - 2077.07
          - 958.29
        - - 1849.13
          - 309.35
        - - 1330.44
          - 320.98
        - - 1325.79
          - 220.97
    R1:
      Coords:
        - - 2684.15
          - 869.91
        - - 2856.27
          - 1181.58
        - - 2816.73
          - 1628.17
        - - 3212.14
          - 1623.51
        - - 3675
          - 1616.54
        - - 3902.95
          - 1439.76
- L1R1L2:
    L1:
      Coords:
        - - 2519.01
          - 1102.5
        - - 2332.93
          - 1416.5
        - - 2053.81
          - 1272.3
        - - 1891
          - 1346.73
        - - 1800.29
          - 1616.54
        - - 1339.75
          - 1616.54
        - - 1174.61
          - 1611.88
    R1:
      Coords:
        - - 2684.15
          - 867.58
        - - 2849.29
          - 1188.56
        - - 2807.42
          - 1618.86
        - - 3221.44
          - 1623.51
        - - 3675
          - 1623.51
        - - 3902.95
          - 1444.42
    L2:
      Coords:
        - - 2367.82
          - 858.28
        - - 2081.73
          - 955.97
        - - 1856.11
          - 325.63
        - - 1339.75
          - 311.68
        - - 1344.4
          - 213.99
- L1R2R1:
    L1:
      Coords:
        - - 2519.01
          - 1102.5
        - - 2332.93
          - 1416.5
        - - 2053.81
          - 1272.3
        - - 1891
          - 1346.73
        - - 1800.29
          - 1616.54
        - - 1339.75
          - 1616.54
        - - 1174.61
          - 1611.88
    R2:
      Coords:
        - - 2688.8
          - 876.88
        - - 2942.33
          - 962.94
        - - 3172.6
          - 330.29
        - - 3677.33
          - 318.66
        - - 3847.12
          - 220.97
    R1:
      Coords:
        - - 2367.82
          - 865.25
        - - 2853.94
          - 1179.26
        - - 2816.73
          - 1621.19
        - - 3221.44
          - 1623.51
        - - 3675
          - 1614.21
        - - 3900.62
          - 1439.76
- L1R1R2:
    L1:
      Coords:
        - - 2519.01
          - 1102.5
        - - 2332.93
          - 1416.5
        - - 2053.81
          - 1272.3
        - - 1891
          - 1346.73
        - - 1800.29
          - 1616.54
        - - 1339.75
          - 1616.54
        - - 1174.61
          - 1611.88
    R1:
      Coords:
        - - 2684.15
          - 867.58
        - - 2849.29
          - 1188.56
        - - 2807.42
          - 1618.86
        - - 3221.44
          - 1623.51
        - - 3675
          - 1623.51
        - - 3902.95
          - 1444.42
    R2:
      Coords:
        - - 2365.49
          - 858.28
        - - 2325.95
          - 539.62
        - - 2737.64
          - 532.64
        - - 3323.78
          - 693.13
        - - 3681.98
          - 697.79
        - - 3675
          - 316.33
        - - 3856.43
          - 218.64
- R1R2L2:
    R1:
      Coords:
        - - 2681.82
          - 867.58
        - - 2849.29
          - 1181.58
        - - 2814.4
          - 1628.17
        - - 3226.09
          - 1628.17
        - - 3681.98
          - 1623.51
        - - 3898.29
          - 1453.72
    R2:
      Coords:
        - - 2523.66
          - 1097.85
        - - 2523.66
          - 320.98
        - - 3181.9
          - 320.98
        - - 3677.33
          - 314
        - - 3861.08
          - 218.64
    L2:
      Coords:
        - - 2356.19
          - 865.25
        - - 2065.44
          - 953.64
        - - 1851.46
          - 320.98
        - - 1332.77
          - 320.98
        - - 1337.42
          - 227.94
- R1L1L2:
    R1:
      Coords:
        - - 2681.82
          - 867.58
        - - 2849.29
          - 1181.58
        - - 2814.4
          - 1628.17
        - - 3226.09
          - 1628.17
        - - 3681.98
          - 1623.51
        - - 3898.29
          - 1453.72
    L1:
      Coords:
        - - 2363.17
          - 860.6
        - - 2081.73
          - 969.92
        - - 1851.46
          - 800.13
        - - 1891
          - 1344.4
        - - 1784
          - 1630.49
        - - 1335.1
          - 1614.21
        - - 1172.28
          - 1625.84
    L2:
      Coords:
        - - 2519.01
          - 1102.5
        - - 2525.98
          - 318.66
        - - 1853.78
          - 316.33
        - - 1339.75
          - 316.33
        - - 1328.12
          - 209.34
- R1L2L1:
    R1:
      Coords:
        - - 2681.82
          - 867.58
        - - 2849.29
          - 1181.58
        - - 2814.4
          - 1628.17
        - - 3226.09
          - 1628.17
        - - 3681.98
          - 1623.51
        - - 3898.29
          - 1453.72
    L2:
      Coords:
        - - 2360.84
          - 865.25
        - - 2072.42
          - 965.27
        - - 1863.09
          - 320.98
        - - 1335.1
          - 320.98
        - - 1330.44
          - 225.62
    L1:
      Coords:
        - - 2523.66
          - 1107.15
        - - 2339.91
          - 1409.53
        - - 2051.49
          - 1274.62
        - - 1895.65
          - 1351.38
        - - 1786.33
          - 1618.86
        - - 1339.75
          - 1625.84
        - - 1172.28
          - 1623.51
- R1R2L1:
    R1:
      Coords:
        - - 2681.82
          - 867.58
        - - 2849.29
          - 1181.58
        - - 2814.4
          - 1628.17
        - - 3226.09
          - 1628.17
        - - 3681.98
          - 1623.51
        - - 3898.29
          - 1453.72
    R2:
      Coords:
        - - 2523.66
          - 1097.85
        - - 2523.66
          - 320.98
        - - 3181.9
          - 320.98
        - - 3677.33
          - 314
        - - 3861.08
          - 218.64
    L1:
      Coords:
        - - 2360.84
          - 860.6
        - - 2084.05
          - 958.29
        - - 1853.78
          - 800.13
        - - 1888.67
          - 1335.1
        - - 1800.29
          - 1625.84
        - - 1337.42
          - 1625.84
        - - 1176.93
          - 1621.19
- R1L1R2:
    R1:
      Coords:
        - - 2681.82
          - 867.58
        - - 2849.29
          - 1181.58
        - - 2814.4
          - 1628.17
        - - 3226.09
          - 1628.17
        - - 3681.98
          - 1623.51
        - - 3898.29
          - 1453.72
    L1:
      Coords:
        - - 2363.17
          - 860.6
        - - 2081.73
          - 969.92
        - - 1851.46
          - 800.13
        - - 1891
          - 1344.4
        - - 1784
          - 1630.49
        - - 1335.1
          - 1614.21
        - - 1172.28
          - 1625.84
    R2:
      Coords:
        - - 2521.33
          - 1095.52
        - - 2521.33
          - 316.33
        - - 3177.25
          - 325.63
        - - 3677.33
          - 316.33
        - - 3851.78
          - 218.64
- R1L2R2:
    R1:
      Coords:
        - - 2681.82
          - 867.58
        - - 2849.29
          - 1181.58
        - - 2814.4
          - 1628.17
        - - 3226.09
          - 1628.17
        - - 3681.98
          - 1623.51
        - - 3898.29
          - 1453.72
    L2:
      Coords:
        - - 2360.84
          - 865.25
        - - 2072.42
          - 965.27
        - - 1863.09
          - 320.98
        - - 1335.1
          - 320.98
        - - 1330.44
          - 225.62
    R2:
      Coords:
        - - 2521.33
          - 1097.85
        - - 2516.68
          - 316.33
        - - 3177.25
          - 311.68
        - - 3679.65
          - 320.98
        - - 3854.1
          - 220.97
`;

// Export the YAML data
window.defaultYaml = defaultYaml;
