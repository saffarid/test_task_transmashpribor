<template>
	<div class="main_page">
		<div class="loading"
			 v-if="pdfEntries.length == 0">
			<span>Загрузка...</span>
		</div>
		<div class="content" v-else>
			<div>
				<table>
					<thead>
					<tr>
						<th colspan="2">Список PDF-файлов(скачивание из static директории)</th>
					</tr>
					</thead>
					<tbody>
					<template v-for="(entry, index) of pdfEntries" :key="index">
						<tr>
							<td>{{ index + 1 }}</td>
							<td><a :href="entry.secret" download>{{ entry.title }}</a></td>
						</tr>
					</template>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {reactive} from 'vue'
import {PdfEntry} from '@/types/PdfEntry'
import * as buffer from "buffer";

export default {
	name: 'App',
	setup() {
		const pdfEntries = reactive<PdfEntry[]>([])

		const config = <AxiosRequestConfig>{
			headers: {
				'Content-Type': 'application/json',
			},
		}

		axios.post('/pdf', JSON.stringify({
			func: 'getAll',
		}), config)
			.then((data: AxiosResponse) => {
				const entries = data.data
				for (let entry of entries) {
					pdfEntries.push(<PdfEntry>{
						title: entry.title,
						secret: entry.secret
					})
				}
			})
			.catch((err: AxiosResponse) => {
				console.log(err)
			})

		return {
			pdfEntries,
		}
	},
}
</script>

<style>

body, #app {
	height: 100vh;
	width: 100vw;
	margin: 0;
}

.main_page {
	height: calc(100% - 40px);
	width: calc(100% - 40px);
	display: grid;
	align-content: start;
	justify-content: start;
	padding: 20px;
	background-color: #343a40;
}

.loading {
	align-self: center;
	justify-self: center;
}

.loading span {
	color: white;
}

.content {

}

td, th {
	color: white;
}

a {
	color: white;
}

td:first-of-type {
	text-align: center;
}

</style>
