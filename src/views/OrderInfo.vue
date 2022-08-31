<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-form :inline="true" :model="params" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input v-model="params.orderNo" placeholder="订单号" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="params.orderStatus" placeholder="状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="orderNo" label="订单号"> </el-table-column>
      <el-table-column prop="totalPrice" label="订单总价"> </el-table-column>
      <el-table-column prop="orderStatus" label="订单状态">
        <template #default="scope">
          <span>{{ $filters.orderMap(scope.row.orderStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="支付方式">
        <template #default="scope">
          <span v-if="scope.row.payType == 1">微信支付</span>
          <span v-else-if="scope.row.payType == 2">支付宝支付</span>
          <span v-else>未支付</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!-- {{ scope.row }} -->
          <el-button size="small" type="warning" @click="toDetail(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="params.pageSize"
      :current-page="params.pageNumber"
      @current-change="currentChange"
    />
  </el-card>
  <el-card class="charts-container">
    <div id="order_charts"></div>
  </el-card>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { getOrders } from "@/api/OrderInfo.js";
import { useRouter } from "vue-router";
export default {
  name: "orderInfo",
  setup() {
    const state = reactive({
      params: {
        orderNo: "",
        orderStatus: "",
        pageNumber: 1,
        pageSize: 10,
      },
      totalCount: 0,
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 0,
          label: "待支付",
        },
        {
          value: 1,
          label: "已支付",
        },
        {
          value: 2,
          label: "配货完成",
        },
        {
          value: 3,
          label: "出库成功",
        },
        {
          value: 4,
          label: "交易成功",
        },
        {
          value: -1,
          label: "手动关闭",
        },
        {
          value: -2,
          label: "超时关闭",
        },
        {
          value: -3,
          label: "商家关闭",
        },
      ],
      tableData: [],
    });
    const router = useRouter();
    const onSearch = (val) => {
      if (val == 1) {
        state.params.pageNumber = 1;
      }
      getOrders(state.params).then((res) => {
        state.tableData = res.list;
        state.params.pageNumber = res.currPage;
        state.params.pageSize = res.pageSize;
        state.totalCount = res.totalCount;
      });
    };
    const currentChange = (val) => {
      state.params.pageNumber = val;
      onSearch();
    };
    const toDetail = (val) => {
      router.push({
        name: "info_detail",
        query: { id: val.orderId },
      });
    };
    let myChart = null;
    onMounted(() => {
      onSearch(); //数据检索
      if (window.echarts) {
        console.log(window.navigator.onLine);
        myChart = window.echarts.init(document.getElementById("order_charts"));
        let dataX = [
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
        ]; //名称
        let dataY = [
          20, 50, 15, 35, 50, 30, 40, 50, 60, 20, 50, 15, 35, 50, 30, 40, 50,
          60,
        ]; //数据
        let zoomShow = false;
        const option = {
          backgroundColor: "#0D2753",
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            top: "10%",
            right: "5%",
            left: "5%",
            bottom: "10%",
          },
          xAxis: [
            {
              type: "category",
              data: dataX,
              axisLine: {
                lineStyle: {
                  color: "rgba(66, 192, 255, .3)",
                },
              },
              axisLabel: {
                interval: 0,
                margin: 10,
                color: "#05D5FF",
                textStyle: {
                  fontSize: 11,
                },
                rotate: "45",
              },
              axisTick: {
                //刻度
                show: false,
              },
            },
          ],
          yAxis: [
            {
              axisLabel: {
                padding: [3, 0, 0, 0],
                formatter: "{value}",
                color: "rgba(95, 187, 235, 1)",
                textStyle: {
                  fontSize: 11,
                },
              },
              axisTick: {
                show: true,
              },
              axisLine: {
                lineStyle: {
                  color: "rgba(66, 192, 255, .3)",
                },
              },
              splitLine: {
                lineStyle: {
                  color: "rgba(255,255,255,0)",
                },
              },
            },
          ],
          dataZoom: [
            //滚动条
            {
              show: zoomShow,
              type: "slider",
              realtime: true,
              startValue: 0,
              endValue: 14,
              xAxisIndex: [0],
              bottom: "10",
              left: "30",
              height: 10,
              borderColor: "rgba(0,0,0,0)",
              textStyle: {
                color: "#05D5FF",
              },
            },
          ],
          series: [
            {
              type: "bar",
              data: dataY,
              barWidth: "10",
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: "rgba(5, 213, 255, 1)", // 0% 处的颜色
                      },
                      {
                        offset: 0.98,
                        color: "rgba(5, 213, 255, 0)", // 100% 处的颜色
                      },
                    ],
                    false
                  ),
                  shadowColor: "rgba(5, 213, 255, 1)",
                  shadowBlur: 4,
                },
              },
              label: {
                normal: {
                  show: true,
                  lineHeight: 10,
                  formatter: "{c}",
                  position: "top",
                  textStyle: {
                    color: "#fff",
                    fontSize: 10,
                  },
                },
              },
            },
          ],
        };
        myChart.setOption(option);
      }
    });
    return {
      ...toRefs(state),
      onSearch,
      currentChange,
      toDetail,
    };
  },
};
</script>

<style>
#order_charts {
  height: 300px;
}
</style>