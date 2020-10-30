<template>
    <span>
        <ul>
            <li
                    v-for="item in autoSelectData[dataType]"
                    :key="item.value"
                    v-show="String(value).split(',').includes(String(item.value))"
                    :label="item.label"
                    :value="item.value"
            >
                {{ item.label }}
            </li>
        </ul>
    </span>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name: 'selectTableDataForm',
        data() {
            return {}
        },
        computed: {
            ...mapState({
                autoSelectData: function (state) {
                    if (!state.common.autoSelectData[this.dataType]) {
                        return {
                            [this.dataType]: []
                        }
                    }
                    return state.common.autoSelectData
                }
            })
        },
        props: {
            dataType: String,
            value: {
                default: ''
            }
        }
    }
</script>
